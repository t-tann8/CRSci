const { Sequelize, Op, fn, col, literal } = require("sequelize");
const { logger } = require("../Logs/logger.js");
// @ts-ignore
const { sequelize, Classroom, Standard, ClassroomCourses, ClassroomStudent, User, DailyUpload, Resource, Video, VideoTracking, Question, VideoQuestionAnswer, AssessmentResourcesDetail, AssessmentAnswer, DailyProgress, Enrollment } = require("../models/index.js");
const { RESOURCE_TYPES, CLASSROOM_STATUS } = require("../utils/enumTypes.js");

function canSubmitAssessment(startDate, accessibleDay, daysToAdd) {
    accessibleDay = Number(accessibleDay);
    daysToAdd = Number(daysToAdd);
    const uploadDateObj = new Date(startDate);
    uploadDateObj.setDate(uploadDateObj.getDate() + accessibleDay + daysToAdd + 1);
    const today = new Date();
    if (today > uploadDateObj) {
        return false;
    }
    return true;
}

function isReleased(startDate, accessibleDay) {
    accessibleDay = Number(accessibleDay);
    const accessibleDate = new Date(startDate);
    accessibleDate.setDate(accessibleDate.getDate() + accessibleDay);
    const today = new Date();
    const released = today >= accessibleDate;

    // Format the date to 'YYYY-MM-DD'
    const formattedDate = accessibleDate.toISOString().split('T')[0];

    return {
        released: released,
        date: formattedDate
    };
}

const getTeacherDashboardSummaries = async ({ teacherId }) => {
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

        const totalClassrooms = classrooms.length;
        const totalStudents = classrooms?.reduce((total, classroom) => total + classroom?.classroomStudents?.length, 0);

        const studentCounts = await ClassroomStudent.findAll({
            attributes: [
                [fn("date_trunc", "year", col("createdAt")), "year"],
                [fn("date_trunc", "month", col("createdAt")), "month"],
                [fn("count", "*"), "count"],
            ],
            where: {
                classroomId: classrooms?.map(classroom => classroom.id)
            },
            group: ["year", "month"],
            order: [
                [fn("date_trunc", "year", col("createdAt")), "ASC"],
                [fn("date_trunc", "month", col("createdAt")), "ASC"]
            ],
            raw: true,
        });

        // Transform the data into the desired format
        const formattedResults = studentCounts?.map(row => ({
            year: new Date(row.year).getFullYear(),
            month: new Date(row.month).getMonth() + 1, // Months are 0-indexed in JavaScript
            count: parseInt(row.count, 10)
        }));

        // Calculate cumulative count
        let cumulativeCount = 0;
        const cumulativeResults = formattedResults?.map(row => {
            cumulativeCount += row.count;
            return {
                year: row.year,
                month: row.month,
                count: cumulativeCount
            };
        });

        const teacherClassroomResults = await sequelize.query(`
            SELECT
                c.id AS classroom_id,
                c.name AS classroom_name,
                u.id AS student_id,
                u.name AS student_name,
                u.email AS student_email,
                u.image AS student_image,
                COUNT(e.id) AS standard_count,
                SUM(e.result) AS total_performance,
                CASE 
                    WHEN COUNT(e.id) > 0 THEN ROUND(SUM(e.result)::numeric / COUNT(e.id), 2)
                    ELSE 0 
                END AS class_result
            FROM
                public."Classrooms" AS c
            INNER JOIN
                public."Enrollments" AS e
                ON c.id = e."classroomId"
            INNER JOIN
                public."Users" AS u
                ON e."studentId" = u.id
            WHERE
                c."teacherId" = '${teacherId}' AND c."status" = 'active'
            GROUP BY
                c.id, c.name, u.id, u.name, u.email, u.image
            ORDER BY
                u.name ASC
        `,);
        const enrollments = teacherClassroomResults[0];

        const data = await Classroom.findAll({
            where: { status: CLASSROOM_STATUS.ACTIVE, teacherId: teacherId },
            attributes: ["id", "name"],
            include: [
                {
                    model: ClassroomCourses,
                    as: 'classroomCourses',
                    attributes: ['id', 'startDate'],
                    include: [{
                        model: Standard,
                        as: 'standard',
                        attributes: ['id', 'name'],
                        include: [{
                            model: DailyUpload,
                            as: 'dailyUploads',
                            attributes: ['id', 'accessibleDay', 'weightage'],
                            where: {
                                weightage: {
                                    [Op.gt]: 0
                                }
                            },
                            required: true,
                            separate: true,
                            include: [{
                                model: Resource,
                                as: 'resource',
                                attributes: ['id', 'name', 'type', 'topic', 'url'],
                                include: [
                                    {
                                        model: Video,
                                        as: 'video',
                                        attributes: ['id'],
                                        include: [{
                                            separate: true,
                                            model: Question,
                                            as: 'questions',
                                            required: false,
                                            attributes: ['id', 'totalMarks'],
                                        }]
                                    },
                                    {
                                        model: AssessmentResourcesDetail,
                                        as: 'AssessmentResourcesDetail',
                                        attributes: ['id', 'totalMarks', 'deadline']
                                    }
                                ]
                            }]
                        }]
                    }],
                },
            ],
        });

        // Current date for comparison
        const today = new Date();
        
        // handle each class
        const transformedData = data?.map(classItem => {
            const standardsMap = new Map();

            // Iterate over each course/standard in the classroom to handle current total weightages in class
            classItem.classroomCourses?.forEach(course => {
                const standard = course.standard;
                if (standard) {
                    // If the standard is not already in the map, add it
                    if (!standardsMap.has(standard.id)) {
                        standardsMap.set(standard.id, {
                            standardId: standard.id,
                            standardName: standard.name,
                            currentTotalWeightage: 0,
                        });
                    }

                    const standardEntry = standardsMap.get(standard.id);

                    // Calculate the total weightage for the standard based on daily uploads up to today
                    if (standard.dailyUploads && standard.dailyUploads.length > 0) {
                        standardEntry.currentTotalWeightage += standard.dailyUploads
                            .filter((upload) => {
                                const accessibleDate = new Date(course.startDate);
                                accessibleDate.setDate(accessibleDate.getDate() + upload.accessibleDay);
                                return (today >= accessibleDate)
                            })
                            .reduce((acc, upload) => acc + upload.weightage, 0);
                    }

                }
            });

            const standardsArray = Array.from(standardsMap.values());

            // Calculate total and average weightage for the classroom
            const totalWeightage = standardsArray.reduce((sum, standard) => sum + standard.currentTotalWeightage, 0);
            const numberOfStandards = standardsArray.length;
            const averageWeightage = numberOfStandards > 0 ? totalWeightage / numberOfStandards : 0;

            // Filter enrollments for the current classroom
            const currentClassEnrollments = enrollments.filter(enrollment => enrollment.classroom_id === classItem.id);

            // Calculate average result for the classroom
            const avgResult = currentClassEnrollments.length > 0
            ? currentClassEnrollments.reduce((sum, enrollment) => sum + parseFloat(enrollment.class_result), 0) / currentClassEnrollments.length
            : 0;

            return {
                classId: classItem.id,
                className: classItem.name,
                avgObtainedWeightage: avgResult,
                avgTotalWeightage: averageWeightage,
            };
        });

        // need at max 5 students for dashboard
        const students = enrollments.slice(0, 5).map(enrollment => ({
            userId: enrollment.student_id,
            userName: enrollment.student_name,
            userEmail: enrollment.student_email,
            image: enrollment.student_image,
            totalObtainedScore: enrollment.class_result,
            classId: enrollment.classroom_id,
            className: enrollment.classroom_name,
        }));

        return {
            code: 200,
            data: {
                totalClassrooms,
                totalStudents,
                usersJoining: cumulativeResults,
                students: students,
                avgObtainedWeightage: transformedData.length > 0 ? (transformedData.reduce((acc, classItem) => acc + parseFloat(classItem.avgObtainedWeightage), 0) / transformedData.length).toFixed(2) : 0,
                avgTotalWeightage: transformedData.length > 0 ? (transformedData.reduce((acc, classItem) => acc + parseFloat(classItem.avgTotalWeightage), 0) / transformedData.length).toFixed(2) : 0
            }
        };
    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while getting total classrooms and students of teacher for teacher dahsboard');
        return { code: 500 };
    }
}

const getAdminDashboardSummaries = async () => {
    try {
        const users = await User.findAll({});

        const userCountData = await User.findAll({
            attributes: [
                [fn("date_trunc", "year", col("createdAt")), "year"],
                [fn("date_trunc", "month", col("createdAt")), "month"],
                [fn("count", "*"), "count"],
            ],
            group: ["year", "month"],
            order: [
                [literal("date_trunc('year', \"createdAt\")"), "ASC"],
                [literal("date_trunc('month', \"createdAt\")"), "ASC"]
            ],
            raw: true,
        });

        // Transform the data into the desired format
        const formattedResults = userCountData.map(row => ({
            year: new Date(row.year).getFullYear(),
            month: new Date(row.month).getMonth() + 1, // Months are 0-indexed in JavaScript
            count: parseInt(row.count, 10)
        }));

        // Calculate cumulative count
        let cumulativeCount = 0;
        const cumulativeResults = formattedResults.map(row => {
            cumulativeCount += row.count;
            return {
                year: row.year,
                month: row.month,
                count: cumulativeCount
            };
        });

        const videos = await Resource.findAll({
            where: { type: RESOURCE_TYPES.VIDEO },
        });

        const resources = await Resource.findAll({});

        const result = {
            usersJoining: cumulativeResults,
            usersCount: users.length,
            videosCount: videos.length,
            resourcesCount: resources.length
        }

        return { code: 200, data: result };
    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while getting overview of users and resources for admin dahsboard');
        return { code: 500 };
    }
}

const getStudentDashboardSummaries = async ({ studentId }) => {
    try {
        const existingStudent = await User.findByPk(studentId)
        if (!existingStudent) {
            return { code: 404, message: 'Student not found' };
        }

        // First, find the classroom student
        const classroomStudent = await ClassroomStudent.findOne({
            where: { studentId },
            include: [{
                model: Classroom,
                as: 'classroom',
                where: { status: CLASSROOM_STATUS.ACTIVE },
                required: true
            }]
        });

        if (!classroomStudent) {
            const result = {
                studentName: existingStudent.name,
                standardsCount: 0,
                classroomName: '',
                standardsData: [],
                videosData: [],
                averageObtainedWeightage: 0,
                averageTotalWeightage: 0,
                assignmentsSolved: 0,
                assignmentsLeft: 0,
                assignmentsMissed: 0,
            };

            return { code: 200, data: result };
        }

        // Then, when you need the classroom courses, you can load them
        const classroomCourses = await ClassroomCourses.findAll({
            where: { classroomId: classroomStudent?.classroom.id },
            include: [{
                model: Standard,
                as: 'standard'
            }]
        });

        // Count of standards
        const standardsCount = classroomCourses?.length;

        // Classroom name
        const classroomName = classroomStudent?.classroom.name;

        // For each standard, get its name and count of video and non-video resources
        const standardsData = await Promise.all(classroomCourses?.slice(0, Math.min(3, classroomCourses.length)).map(async (course) => {
            const dailyUploads = await DailyUpload.findAll({
                where: { standardId: course.standard.id },
                include: [{
                    model: Resource,
                    as: 'resource'
                }]
            });

            const videoResourcesCount = dailyUploads?.filter(upload => upload.resource.type === 'video')?.length || 0;
            const nonVideoResourcesCount = dailyUploads?.length - videoResourcesCount;

            return {
                standardId: course.standard.id,
                standardName: course.standard.name,
                videoResourcesCount,
                nonVideoResourcesCount
            };
        }));

        const data = await ClassroomStudent.findOne({
            where: {
                studentId: studentId
            },
            attributes: ["id"],
            include: [
                {
                    model: Classroom,
                    as: 'classroom',
                    where: { status: CLASSROOM_STATUS.ACTIVE },
                    attributes: ["id", "name"],
                    include: [{
                        model: ClassroomCourses,
                        as: 'classroomCourses',
                        attributes: ["id", "startDate"],
                        include: [{
                            model: Standard,
                            as: 'standard',
                            attributes: ["id", "name"],
                            include: [{
                                model: DailyUpload,
                                as: 'dailyUploads',
                                attributes: ['id', 'accessibleDay', 'weightage'],
                                where: {
                                    weightage: {
                                        [Op.gt]: 0
                                    }
                                },
                                required: true,
                                separate: true,
                                include: [{
                                    model: Resource,
                                    as: 'resource',
                                    attributes: ['id', 'name', 'type', 'topic', 'url'],
                                    include: [
                                        {
                                            model: Video,
                                            as: 'video',
                                            attributes: ['id'],
                                            include: [{
                                                separate: true,
                                                model: Question,
                                                as: 'questions',
                                                required: false,
                                                attributes: ['id', 'totalMarks'],
                                            }]
                                        },
                                        {
                                            model: AssessmentResourcesDetail,
                                            as: 'AssessmentResourcesDetail',
                                            attributes: ['id', 'totalMarks', 'deadline'],
                                        }
                                    ]
                                }]
                            }]
                        }],
                    }],
                }
            ],
        });

        const plainData = await data?.get({ plain: true });

        if (!plainData || !plainData.classroom) {
            const result = {
                studentName: existingStudent.name,
                standardsCount: 0,
                classroomName: '',
                standardsData: [],
                averageObtainedWeightage: 0,
                averageTotalWeightage: 0,
                assignmentsSolved: 0,
                assignmentsLeft: 0,
                assignmentsMissed: 0,
            };
            return {
                code: 200,
                data: result
            };
        }
        if (!plainData.classroom.classroomCourses || plainData.classroom.classroomCourses.length <= 0) {
            const result = {
                studentName: existingStudent.name,
                standardsCount: 0,
                classroomName: plainData.classroom.name,
                standardsData: [],
                averageObtainedWeightage: 0,
                averageTotalWeightage: 0,
                assignmentsSolved: 0,
                assignmentsLeft: 0,
                assignmentsMissed: 0,
            };
            return {
                code: 200,
                data: result
            };
        }

        const transformedData = data?.classroom?.classroomCourses?.map(course => {
            const standard = course?.standard;
            let totalWeightage = 0;

            standard?.dailyUploads?.forEach(upload => {
                // Only consider uploads with startDay + accessibleDay < today
                if (isReleased(course.startDate, upload.accessibleDay)) {
                    totalWeightage += upload.weightage;
                }
            })
            return {
                standardId: standard.id,
                standardName: standard.name,
                totalWeightage: parseFloat(totalWeightage.toFixed(1))
            };
        })

        // Calculate average total weightage
        const totalTotalWeightage = transformedData?.reduce((total, entry) => {
            return total + entry.totalWeightage;
        }, 0);
        
        const averageTotalWeightage = transformedData?.length > 0 
            ? (totalTotalWeightage / transformedData.length).toFixed(2) 
            : 0;


        const studentClassroomResult = await sequelize.query(`
            SELECT
                c.id AS classroom_id,
                c.name AS classroom_name,
                u.id AS student_id,
                u.name AS student_name,
                u.email AS student_email,
                u.image AS student_image,
                COUNT(e.id) AS standard_count,
                SUM(e.result) AS total_performance,
                CASE 
                    WHEN COUNT(e.id) > 0 THEN ROUND(SUM(e.result)::numeric / COUNT(e.id), 2)
                    ELSE 0 
                END AS class_result
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
                e."studentId" = '${studentId}' AND c."status" = 'active'
            GROUP BY
                c.id, c.name, u.id, u.name, u.email, u.image
        `,);
        // Calculate average obtained weightage
        const averageObtainedWeightage = studentClassroomResult[0][0].class_result;

        const rawAttemptedAssessmentsResults = await sequelize.query(`
            SELECT
                c.id AS classroom_Id,
                cc."standardId" AS standard_id,
                cc."startDate" AS start_date,
                du."accessibleDay" AS accessible_day,
                ard."resourceId" AS assessment_resource_id,
                ard.id AS assessment_resource_detail_id,
                ard."deadline" AS deadline,
                aa.id AS assessment_answer_id
            FROM
                public."Classrooms" c
            INNER JOIN
                public."ClassroomStudents" cs
                ON c.id = cs."classroomId"
            INNER JOIN
                public."ClassroomCourses" cc
                ON c.id = cc."classroomId"
            INNER JOIN
                public."DailyUploads" du
                ON du."standardId" = cc."standardId"
            INNER JOIN
                public."AssessmentResourcesDetails" ard
                ON ard."resourceId" = du."resourceId"
            LEFT JOIN
                public."AssessmentAnswers" aa
                ON ard.id = aa."assessmentResourcesDetailId"
                AND aa."userId" = '${studentId}'
                AND aa."classroomId" = c.id
                AND aa."standardId" = cc."standardId"
            WHERE
                c."status" = 'active'
        `);

        const attemptedAssessmentsResults = rawAttemptedAssessmentsResults[0];

        let assignmentsSolved = 0;
        let assignmentsLeft = 0;
        let assignmentsMissed = 0;

        attemptedAssessmentsResults.forEach(attemptedAssessment => {
            if (attemptedAssessment.assessment_answer_id) {
                assignmentsSolved++;
            } else if (!attemptedAssessment.assessment_answer_id && canSubmitAssessment(attemptedAssessment.start_date, attemptedAssessment.accessible_day, attemptedAssessment.deadline)) {
                assignmentsLeft++;
            } else {
                assignmentsMissed++;
            }
        });

        const result = {
            studentName: existingStudent.name,
            standardsCount,
            classroomName,
            standardsData,
            averageObtainedWeightage,
            averageTotalWeightage,
            assignmentsSolved,
            assignmentsLeft,
            assignmentsMissed
        };

        return { code: 200, data: result };

    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while getting total classrooms and courses of student for student dahsboard');
        return { code: 500 };
    }
}

module.exports = {
    getTeacherDashboardSummaries,
    getAdminDashboardSummaries,
    getStudentDashboardSummaries
};
