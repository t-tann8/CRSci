const { Sequelize, Op } = require("sequelize");
const { logger } = require("../Logs/logger.js");
// @ts-ignore
const { sequelize, Classroom, Standard, ClassroomCourses, ClassroomStudent, User, DailyUpload, Resource, Video, VideoTracking, Question, VideoQuestionAnswer, AssessmentResourcesDetail, AssessmentAnswer, DailyProgress, Enrollment, School } = require("../models/index.js");
const { RESOURCE_TYPES, CLASSROOM_STATUS } = require("../utils/enumTypes.js");
const ROLES = require("../models/roles/index.js");

async function removeAllObtainedMarksExceptMCQs(classroomId, studentId, transaction) {
    const resources = await Resource.findAll({
        include: [
            {
                model: Video,
                as: 'video',
                include: {
                    model: Question,
                    as: 'questions',
                    include: {
                        model: VideoQuestionAnswer,
                        as: 'answers',
                        where: {
                            userId: studentId,
                            classroomId: classroomId
                        }
                    }
                }
            },
            {
                model: AssessmentResourcesDetail,
                as: 'AssessmentResourcesDetail',
                include: {
                    model: AssessmentAnswer,
                    as: 'assessmentAnswers',
                    where: {
                        userId: studentId,
                        classroomId: classroomId
                    }
                }
            }
        ],
        transaction
    });

    // if video questions are mcqs leave them answered else remove all assigned marks so new teacher can mark them as he wants
    await Promise.all(resources.map(async resource => {
        if (resource.video) {
            await Promise.all(resource.video.questions.map(async question => {
                if (!question.correctOption) {
                    await Promise.all(question.answers.map(async answer => {
                        await answer.update({ obtainedMarks: -1 }, { transaction });
                    }));
                }
            }));
        }
        if (resource.AssessmentResourcesDetail) {
            await Promise.all(resource.AssessmentResourcesDetail.assessmentAnswers.map(async answer => {
                await answer.update({ obtainedMarks: -1 }, { transaction });
            }));
        }
    }));
}

async function calculateResultOnStudentAddition(classroomId, standardId, studentId, transaction) {
    const results = await sequelize.query(`
        SELECT
            du.id AS DailyUploadId,
            v.id AS VideoId,
            q.id AS QuestionId,
            vqa.id AS VideoQuestionAnswerId,
            du."weightage",
            v."totalMarks",
            vqa."obtainedMarks"
        FROM
            public."DailyUploads" du
        INNER JOIN
            public."Videos" v
        ON v."resourceId" = du."resourceId"
        INNER JOIN
            public."Questions" q
        ON q."videoId" = v.id
        INNER JOIN
            public."VideoQuestionAnswers" vqa
        ON vqa."questionId" = q.id
        AND vqa."classroomId" = '${classroomId}' 
        AND vqa."standardId" = '${standardId}' 
        AND vqa."userId" = '${studentId}' 
        WHERE
            du."weightage" > 0
        AND du."standardId" = vqa."standardId"
        AND vqa."obtainedMarks" >= 0
    `, { transaction });

    const result = results[0].reduce((acc, row) => {
        return acc + (row.obtainedMarks / row.totalMarks) * row.weightage;
    }, 0);

    return result;
} 

const createClassroom = async ({ name, teacherId, schoolId }) => {
    try {
        const existingClassroom = await Classroom.findOne({
            where: {
                name,
                schoolId,
            }
        });
        if (existingClassroom) {
            return { code: 409 };
        }

        const classroom = await Classroom.create({ name, teacherId, schoolId });
        if (!classroom) {
            return { code: 500 };
        }
        return { code: 200, data: classroom };

    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while creating classroom');
        return { code: 500 };
    }
};

const getClassroom = async ({ classroomId }) => {
    try {
        const classroom = await Classroom.findOne({ where: { id: classroomId } });
        return { code: 200, data: classroom };

    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while getting the classroom');
        return { code: 500 };
    }
};

const getAllClassroomsOfTeacher = async ({ teacherId }) => {
    try {
        const classrooms = await Classroom.findAll({
            where: {
                teacherId: teacherId,
                status: CLASSROOM_STATUS.ACTIVE
            }
        });
        const options = classrooms?.map(classroom => {
            return { label: classroom.id, value: classroom.name };
        });
        return { code: 200, data: options };

    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while getting all classroom of teacher');
        return { code: 500 };
    }
}

const assignStandardToClassrooms = async ({ classCourses, standardId }) => {
    const transaction = await sequelize.transaction(); // Start transaction
    try {
        // Check if standard exists
        const standard = await Standard.findOne({ where: { id: standardId }, transaction });
        if (!standard) {
            await transaction.rollback(); // Rollback if standard not found
            return { code: 404, message: "Standard not found" };
        }

        const classroomIds = classCourses.map(course => course.classroomId);

        if (new Set(classroomIds).size !== classroomIds.length) {
            await transaction.rollback(); // Rollback on duplicate classrooms
            return { code: 400, message: "Duplicate classrooms are not allowed." };
        }

        // Check if classrooms exist
        const classrooms = await Promise.all(classroomIds.map(id => 
            Classroom.findOne({ where: { id }, raw: true, transaction })
        ));

        const notFoundIds = classroomIds.filter((id, index) => !classrooms[index]);
        if (notFoundIds.length > 0) {
            await transaction.rollback(); // Rollback if some classrooms not found
            return { code: 404, message: `Classrooms not found: ${notFoundIds.join(', ')}` };
        }

        // Check for inactive classrooms
        const inactiveNames = classrooms
            .filter(classroom => classroom && classroom.status === CLASSROOM_STATUS.INACTIVE)
            .map(classroom => classroom.name);
        if (inactiveNames.length > 0) {
            await transaction.rollback(); // Rollback on inactive classrooms
            return { code: 404, message: `Inactive classrooms: ${inactiveNames.join(', ')}` };
        }

        // Check if standard is already assigned to classrooms
        const classroomsWithStandard = await Classroom.findAll({
            where: { id: classroomIds },
            include: [{
                model: ClassroomCourses,
                as: 'classroomCourses',
                where: { standardId },
                required: true
            }],
            transaction
        });
        if (classroomsWithStandard.length > 0) {
            const classroomNames = classroomsWithStandard.map(classroom => classroom.name);
            await transaction.rollback(); // Rollback if standard already assigned
            return { code: 409, message: `Classrooms with this course already assigned are: ${classroomNames.join(', ')}` };
        }

        // Create new classroom-course relationships and enrollments
        await Promise.all(classCourses.map(async course => {
            const existingEntry = await ClassroomCourses.findOne({
                where: { classroomId: course.classroomId, standardId },
                transaction
            });
            if (!existingEntry) {
                await ClassroomCourses.create({
                    classroomId: course.classroomId,
                    standardId,
                    startDate: course.startDate
                }, { transaction });

                const students = await ClassroomStudent.findAll({ 
                    where: { classroomId: course.classroomId }, 
                    transaction 
                });
                const enrollments = students.map(student => ({
                    classroomId: course.classroomId,
                    standardId,
                    studentId: student.studentId,
                    result: 0
                }));
                await Enrollment.bulkCreate(enrollments, { transaction });
            }
        }));

        await transaction.commit(); // Commit transaction if all operations succeed
        return { code: 200, data: classCourses };

    } catch (error) {
        await transaction.rollback(); // Rollback transaction on error
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while assigning standard to classroom');
        return { code: 500 };
    }
}

const getSummarizedClassroomsOfTeacher = async ({ teacherId }) => {
    try {
        const classrooms = await Classroom.findAll({
            where: {
                teacherId: teacherId,
                status: CLASSROOM_STATUS.ACTIVE
            },
            include: [{
                model: ClassroomStudent,
                as: 'classroomStudents'
            }]
        });

        const classroomsWithStudents = classrooms?.map(classroom => {
            const { id, name, classroomStudents } = classroom.toJSON();
            return {
                id,
                name,
                studentCount: classroomStudents.length
            };
        });

        return { code: 200, data: classroomsWithStudents };

    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while getting summarized classrooms of teacher');
        return { code: 500 };
    }
}

const getClassesAndCourses = async ({ teacherId }) => {
    try {
        const summarizedStandards = await ClassroomCourses.findAll({
            attributes: ['id'],
            include: [{
                model: Classroom,
                as: 'classroom',
                where: {
                    teacherId: teacherId,
                    status: CLASSROOM_STATUS.ACTIVE
                },
                attributes: ['name']
            },
            {
                model: Standard,
                as: 'standard',
                attributes: ['id', 'name']
            }],
            limit: 5
        })

        const transformedSummarizedStandards = summarizedStandards?.map(traversingStandard => {
            const { id, classroom, standard } = traversingStandard.toJSON();
            return { id, className: classroom.name, standardName: standard.name, standardId: standard.id }
        });

        return { code: 200, data: transformedSummarizedStandards };
    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while getting overview of standards for teacher dahsboard');
        return { code: 500 };
    }
}

const deleteClassCourse = async ({ classroomCourseId }) => {
    const transaction = await sequelize.transaction(); // Start a new transaction
    try {
        const classroomCourse = await ClassroomCourses.findByPk(classroomCourseId, { transaction });
        if (!classroomCourse) {
            await transaction.rollback(); // Rollback transaction if not found
            return { code: 404, message: 'Relation between standard and class Not found' };
        }

        const classroom = await Classroom.findOne({ where: { id: classroomCourse.classroomId }, transaction });
        if (!classroom) {
            await transaction.rollback(); // Rollback transaction if not found
            return { code: 404, message: 'Classroom not found' };
        }
        if (classroom.status !== CLASSROOM_STATUS.ACTIVE) {
            await transaction.rollback(); // Rollback transaction if classroom is not active
            return { code: 404, message: 'Classroom is not active any more' };
        }

        const enrollments = await Enrollment.findAll({ where: { classroomId: classroomCourse.classroomId, standardId: classroomCourse.standardId }, transaction });
        await Promise.all(enrollments.map(enrollment => enrollment.destroy({ transaction }))); // Ensure destroy is within transaction

        const deleted = await classroomCourse.destroy({ transaction }); // Ensure destroy is within transaction

        await transaction.commit(); // Commit transaction if all operations succeed

        return { code: 200, data: deleted };
    } catch (error) {
        await transaction.rollback(); // Rollback transaction in case of error
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while deleting class course');
        return { code: 500 };
    }
};

const getClassroomStudents = async ({ classroomId, page, limit }) => {
    try {
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        if (isNaN(page) || page < 1) {
            page = 1;
        }

        if (isNaN(limit) || limit < 1) {
            limit = 10;
        }
        const offset = (page - 1) * limit;

        const classroom = await Classroom.findByPk(classroomId);
        if (!classroom) {
            return { code: 404, message: 'Classroom not found' };
        }

        // Count total enrollments
        const countResult = await sequelize.query(`
            SELECT COUNT(DISTINCT u.id) AS total_count
            FROM public."Classrooms" AS c
            INNER JOIN public."ClassroomCourses" AS cc ON c.id = cc."classroomId"
            INNER JOIN public."Standards" AS s ON cc."standardId" = s.id
            INNER JOIN public."Enrollments" AS e ON c.id = e."classroomId" AND s.id = e."standardId"
            INNER JOIN public."Users" AS u ON e."studentId" = u.id
            WHERE c.id = '${classroomId}'
        `,);

        const totalCount = countResult[0][0].total_count;

        const totalPages = Math.ceil(totalCount / limit);

        // Fetch paginated results
        const data = await sequelize.query(`
            SELECT
                c.id AS classroom_id,
                c.name AS classroom_name,
                u.id AS student_id,
                u.name AS student_name,
                u.email AS student_email,
                u.image AS student_image,
                SUM(e.result) AS all_standard_results,
                COUNT(e.id) AS count_of_standards
            FROM
                public."Classrooms" AS c
            INNER JOIN
                public."ClassroomCourses" AS cc
                ON c.id = cc."classroomId"
            INNER JOIN
                public."Standards" AS s
                ON cc."standardId" = s.id
            INNER JOIN
                public."Enrollments" AS e
                ON c.id = e."classroomId" AND s.id = e."standardId"
            INNER JOIN
                public."Users" AS u
                ON e."studentId" = u.id
            WHERE
                c.id = '${classroomId}'
            GROUP BY
                c.id, c.name, u.id, u.name, u.email, u.image
            ORDER BY
                u.name ASC
            LIMIT  ${limit} OFFSET ${offset}
        `,);

        const StudentClassResults = data[0].map(student => ({
            id: student.student_id,
            name: student.student_name,
            email: student.student_email,
            image: student.student_image,
            performance: parseFloat((student.all_standard_results / student.count_of_standards).toFixed(2)), // Formatting result
            gradeId: student.classroom_id,
            grade: student.classroom_name
        }));

        return {
            code: 200,
            data: {
                classId: classroomId,
                className: classroom.name,
                totalCount,
                totalPages: totalPages,
                students: StudentClassResults
            }
        };
    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while getting classroom students');
        return { code: 500 };
    }
};


const addStudentToClassroom = async ({ classroomId, email, schoolId }) => {
    const transaction = await sequelize.transaction();

    try {
        const classroom = await Classroom.findOne({ where: { id: classroomId }, transaction });
        if (!classroom) {
            await transaction.rollback();
            return { code: 404 };
        }
        if (classroom.status !== CLASSROOM_STATUS.ACTIVE) {
            await transaction.rollback();
            return { code: 400, message: 'Classroom is not active any more' };
        }

        const student = await User.findOne({ where: { email: email }, transaction });
        if (!student) {
            await transaction.rollback();
            return { code: 405 };
        }
        if (student.role !== ROLES.STUDENT) {
            await transaction.rollback();
            return { code: 400, message: 'Only Students are allowed to be added to a classroom' };
        }
        if (student.school_id !== schoolId) {
            await transaction.rollback();
            return { code: 403, message: 'Student does not exist in this school' };
        }

        const existingClassroomStudent = await ClassroomStudent.findOne({
            where: { studentId: student.id },
            include: [
                {
                    model: Classroom,
                    as: 'classroom',
                    where: { status: CLASSROOM_STATUS.ACTIVE }
                }
            ],
            transaction
        });
        if (existingClassroomStudent) {
            await transaction.rollback();
            return { code: 409, message: `Student is already enrolled in ${existingClassroomStudent.classroom.name}` };
        }

        const classroomStudent = await ClassroomStudent.create({ classroomId: classroomId, studentId: student.id }, { transaction });

        const classroomCourses = await ClassroomCourses.findAll({ where: { classroomId: classroomId }, transaction });

         // Calculate results for each enrollment
         const enrollments = await Promise.all(classroomCourses.map(async (course) => {
            const result = await calculateResultOnStudentAddition(classroomId, course.standardId, student.id, transaction);

            return {
                classroomId: classroomId,
                standardId: course.standardId,
                studentId: student.id,
                result: result || 0
            };
        }));

        await Enrollment.bulkCreate(enrollments, { transaction });

        await transaction.commit();
        return { code: 200, data: classroomStudent };
    } catch (error) {
        await transaction.rollback();
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while adding student to classroom');
        return { code: 500 };
    }
};

const removeStudentFromClassroom = async ({ classroomStudentId }) => {
    const transaction = await sequelize.transaction();

    try {
        const classroomStudent = await ClassroomStudent.findByPk(classroomStudentId, { transaction });
        if (!classroomStudent) {
            await transaction.rollback();
            return { code: 404, message: 'Relation between student and class not found' };
        }

        const classroom = await Classroom.findOne({ where: { id: classroomStudent.classroomId }, transaction });
        if (!classroom) {
            await transaction.rollback();
            return { code: 404, message: 'Classroom not found' };
        }
        if (classroom.status !== CLASSROOM_STATUS.ACTIVE) {
            await transaction.rollback();
            return { code: 404, message: 'Classroom is not active any more' };
        }

        await removeAllObtainedMarksExceptMCQs(classroomStudent.classroomId, classroomStudent.studentId, transaction);

        const deleted = await classroomStudent.destroy({ transaction });

        await Enrollment.destroy({
            where: {
                classroomId: classroomStudent.classroomId,
                studentId: classroomStudent.studentId
            },
            transaction
        });

        await transaction.commit();
        return { code: 200, data: deleted };
    } catch (error) {
        await transaction.rollback();
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while removing student from classroom');
        return { code: 500 };
    }
};

const updateClassroomStudent = async ({ studentId, name, email, classroomId, image }) => {
    const t = await sequelize.transaction();

    try {
        const student = await User.findOne({ where: { id: studentId }, transaction: t });
        if (!student) {
            await t.rollback();
            return { code: 404, message: 'Student not found' };
        }

        let updatedClassroomStudent = {};
        let updatedStudent = {};
        let updateData = {};

        if (classroomId) {
            const classroom = await Classroom.findOne({ where: { id: classroomId }, transaction: t });
            if (!classroom) {
                await t.rollback();
                return { code: 404, message: 'Classroom not found' };
            }
            if (classroom.status !== CLASSROOM_STATUS.ACTIVE) {
                await t.rollback();
                return { code: 404, message: 'Classroom is not active anymore' };
            }
            const existingClassroomStudent = await ClassroomStudent.findOne({ where: { classroomId, studentId }, transaction: t });
            if (existingClassroomStudent) {
                await t.rollback();
                return { code: 409, message: 'Conflict: Classroom student already exists' };
            }
            const classroomStudent = await ClassroomStudent.findOne({
                where: {
                    studentId
                },
                include: [{
                    model: Classroom,
                    as: 'classroom',
                    where: { status: CLASSROOM_STATUS.ACTIVE },
                    required: true
                }],
                transaction: t
            });
            if (classroomStudent) {
                const oldEnrollments = await Enrollment.findAll({ 
                    where: { 
                        classroomId: classroomStudent.classroomId, 
                        studentId 
                    }, 
                    transaction: t 
                });
                await removeAllObtainedMarksExceptMCQs(classroomStudent.classroomId, studentId, t)
                await Promise.all(oldEnrollments.map(enrollment => enrollment.destroy({ transaction: t })));
                updatedClassroomStudent = await classroomStudent.update({ classroomId: classroomId }, { transaction: t });
            }
            const classroomCourses = await ClassroomCourses.findAll({ where: { classroomId }, transaction: t });
            // Use simple promises for creating new enrollments
            const newEnrollmentsPromises = classroomCourses.map(async course => {
                const result = await calculateResultOnStudentAddition(classroomId, course.standardId, studentId, t);
                return Enrollment.create({
                    classroomId: classroomId,
                    standardId: course.standardId,
                    studentId: studentId,
                    result
                }, { transaction: t });
            });

            await Promise.all(newEnrollmentsPromises);
        }

        if (email) {
            const isEmailRegistered = await User.findOne({ where: { email }, transaction: t });
            if (isEmailRegistered) {
                await t.rollback();
                return { code: 409, message: 'Conflict: Email already registered' };
            }
            updateData.email = email;
        }
        if (name) updateData.name = name;
        if (image) updateData.image = image;

        if (Object.keys(updateData).length > 0) {
            updatedStudent = await student.update(updateData, { transaction: t });
        }

        // Extract updated information if updates were made
        const updatedInfo = {};
        if (updatedStudent) {
            updatedInfo.name = updatedStudent.name;
            updatedInfo.email = updatedStudent.email;
            updatedInfo.image = updatedStudent.image;
        }
        if (updatedClassroomStudent) {
            updatedInfo.classroomId = updatedClassroomStudent.classroomId;
        }

        // Commit the transaction
        await t.commit();

        return {
            code: 200,
            data: {
                id: studentId,
                ...updatedInfo
            }
        };
    } catch (error) {
        // Rollback the transaction if any error occurs
        await t.rollback();
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while updating classroom student');
        return { code: 500, message: error.message };
    }
}

const updateTeacherClassrooms = async ({ schoolId, teacherId, classroomIds }) => {
    try {
        const teacher = await User.findOne({ where: { id: teacherId, school_id: schoolId } });
        if (!teacher) {
            return { code: 404, message: 'Teacher not found' };
        }

        const classrooms = await Classroom.findAll({ where: { id: classroomIds, schoolId: schoolId } });
        const foundClassroomIds = classrooms?.map(classroom => classroom.id);
        const notFoundClassroomIds = classroomIds?.filter(id => !foundClassroomIds.includes(id));

        if (notFoundClassroomIds.length > 0) {
            const notFoundClassrooms = classrooms?.filter(classroom => notFoundClassroomIds.includes(classroom.id));
            const notFoundClassroomNames = notFoundClassrooms.map(classroom => classroom.name);
            return { code: 404, message: `${notFoundClassroomNames.length > 1 ? 'These classrooms are' : 'This classroom is'} not found: `, notFoundClassroomNames };
        }

        const classroomsWithDifferentTeacher = classrooms.filter(classroom => classroom.teacherId && classroom.teacherId !== teacherId);
        if (classroomsWithDifferentTeacher.length > 0) {
            const classroomsWithDifferentTeacherNames = classroomsWithDifferentTeacher.map(classroom => classroom.name);
            return { code: 409, message: `${classroomsWithDifferentTeacher.length > 1 ? 'These classrooms' : 'This classroom'} already has a different teacher assigned: `, classroomsWithDifferentTeacherNames };
        }

        //classes from which to remove teacher 
        const teacherClassrooms = await Classroom.findAll({ where: { teacherId: teacherId, schoolId: schoolId } });
        const classroomsToRemoveTeacher = teacherClassrooms.filter(classroom => !classroomIds.includes(classroom.id));
        await Promise.all(classroomsToRemoveTeacher.map(classroom => classroom.update({ teacherId: null })));

        //classes in which to add teacher
        const updatedClassrooms = await Promise.all(classrooms.map(classroom => classroom.update({ teacherId })));
        return { code: 200, data: updatedClassrooms };
    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while updating teacher classroom');
        return { code: 500 };
    }
}

const changeClassStatus = async ({ schoolId, classroomId, status }) => {
    try {
        const classroom = await Classroom.findOne({ where: { id: classroomId } });
        if (!classroom) {
            return { code: 404, message: 'Classroom not found' };
        }

        if (classroom.schoolId !== schoolId) {
            return { code: 403, message: 'Unauthorized, class does not belong to this school' };
        }

        if (status === CLASSROOM_STATUS.ACTIVE) {
            const studentsInClassroom = await ClassroomStudent.findAll({
                where: { classroomId: classroomId },
                attributes: ['studentId']
            });

            const studentIds = studentsInClassroom.map(student => student.studentId);

            const activeClassroomsWithStudents = await Classroom.findAll({
                where: {
                    status: CLASSROOM_STATUS.ACTIVE,
                    id: { [Op.ne]: classroomId }
                },
                include: {
                    model: ClassroomStudent,
                    as: 'classroomStudents',
                    where: {
                        studentId: { [Op.in]: studentIds }
                    },
                    include: {
                        model: User,
                        as: 'student',
                    }
                }
            });

            const studentNames = activeClassroomsWithStudents.flatMap(classroom => 
                classroom.classroomStudents.map(cs => cs.student.name)
            );

            if (activeClassroomsWithStudents.length > 0) {
                return { code: 400, message: `${activeClassroomsWithStudents.length} ${activeClassroomsWithStudents.length > 1 ? 'students are' : 'student is'} enrolled in another active classroom: ${studentNames.join(', ')}`}
            }
        }

        const updated = await classroom.update({ status: status });
        return { code: 200, data: updated };

    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while converting class to inactive');
        return { code: 500 };
    }
}

const getSchoolClassrooms = async ({ schoolId, page, limit }) => {
    try {
        const offset = (page - 1) * limit;

        const school = await School.findOne({ where: { id: schoolId } });
        if (!school) {
            return { code: 404, message: 'School not found' };
        }

        const classrooms = await Classroom.findAll({ 
            where: { 
                schoolId 
            },
            attributes: ['id', 'name', 'status'],
            include: {
                model: User,
                attributes: ['name']
            },
            offset,
            limit,
            order: [['createdAt', 'desc']]
        });

        const transformedClassroom = classrooms.map(classroom => ({
            id: classroom.id,
            name: classroom.name,
            status: classroom.status,
            teacher: classroom?.User?.name || 'No Teacher Assigned'
        }));

        const totalClassrooms = await Classroom.count({ where: { schoolId } });
        const totalPages = Math.ceil(totalClassrooms / limit);

        return { 
            code: 200, 
            data: {
                classrooms: transformedClassroom,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                } 
            }
        };
    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while converting class to inactive');
        return { code: 500 };
    }
}

module.exports = {
    createClassroom,
    getClassroom,
    getAllClassroomsOfTeacher,
    assignStandardToClassrooms,
    getSummarizedClassroomsOfTeacher,
    getClassesAndCourses,
    deleteClassCourse,
    getClassroomStudents,
    addStudentToClassroom,
    removeStudentFromClassroom,
    updateClassroomStudent,
    updateTeacherClassrooms,
    changeClassStatus,
    getSchoolClassrooms
};
