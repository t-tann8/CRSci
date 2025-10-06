const { Op } = require("sequelize");
const { logger } = require("../Logs/logger.js");
// @ts-ignore
const { sequelize, Classroom, Standard, ClassroomCourses, ClassroomStudent, User, DailyUpload, Resource, Video, VideoTracking, Question, VideoQuestionAnswer, AssessmentResourcesDetail, AssessmentAnswer, DailyProgress, Enrollment } = require("../models/index.js");
const { CLASSROOM_STATUS, RESOURCE_TYPES } = require("../utils/enumTypes.js");

function timeToSeconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

function compareTimes(time1, time2) {
    const time1Seconds = timeToSeconds(time1);
    const time2Seconds = timeToSeconds(time2);

    if (time1Seconds > time2Seconds) {
        return 1; // time1 is greater than time2
    } else if (time1Seconds < time2Seconds) {
        return -1; // time1 is less than time2
    } else {
        return 0; // time1 is equal to time2
    }
}

function canSubmitAssessment(startDate, accessibleDay, daysToAdd) {
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


async function getClassroomIdOfStudent (studentId) {
    const classroomStudent = await ClassroomStudent.findOne({
        where: {
            studentId: studentId,
        },
        include: {
            model: Classroom,
            as: 'classroom',
            where: {
                status: CLASSROOM_STATUS.ACTIVE
            }
        }
    });
    return classroomStudent?.classroom?.id;
}

async function getResourceDetails ({ resourceType, standardId, studentId, resourceSubcategoryId }) {
    try {
        let resource;
        let totalMarks = 0;
        let weightage = 0;
        let classroomId = '';

        const resourceQuery = {
            where: {
                id: resourceSubcategoryId,
            },
            attributes: ['id', 'totalMarks'],
            include: {
                model: Resource,
                as: 'resource',
                attributes: ['id'],
                include: {
                    model: DailyUpload,
                    as: 'DailyUpload',
                    attributes: ['id', 'weightage'],
                    include: {
                        model: Standard,
                        as: 'standard',
                        attributes: ['id'],
                        where: {
                            id: standardId,
                        }
                    },
                },
            },
        };

        if (resourceType === RESOURCE_TYPES.VIDEO) {
            resource = await Video.findOne(resourceQuery);
        } else {
            resource = await AssessmentResourcesDetail.findOne(resourceQuery);
        }

        if (resource) {
            totalMarks = resource.totalMarks;
            if (resource.resource && resource.resource.DailyUpload && resource.resource.DailyUpload.standard) {
                weightage = resource.resource.DailyUpload.weightage;
            }
        }

        const classroomStudent = await ClassroomStudent.findOne({
            where: {
                studentId: studentId,
            },
            include: {
                model: Classroom,
                as: 'classroom',
                where: {
                    status: CLASSROOM_STATUS.ACTIVE
                }
            }
        });

        if (classroomStudent && classroomStudent.classroom) {
            classroomId = classroomStudent.classroom.id;
        }

        return { weightage, classroomId, totalMarks };
    } catch (error) {
        console.error('Error retrieving resource details:', error);
        throw error;
    }
};

async function checkStudentAndStandard({ role, studentId, standardId }) {
    const student = await User.findByPk(studentId);
    if (!student) {
        return { code: 404, message: 'Student not found' };
    }

    const standard = await Standard.findByPk(standardId);
    if (!standard) {
        return { code: 404, message: 'Standard not found' };
    }

    const studentData = await ClassroomStudent.findOne({
        where: {
            studentId: studentId,
        },
        include: [{
            model: Classroom,
            as: 'classroom',
            where: { status: CLASSROOM_STATUS.ACTIVE },
            required: false,
            include: [{
                model: ClassroomCourses,
                as: 'classroomCourses',
                where: { standardId: standardId },
                required: false
            }]
        }]
    })

    if (!studentData) {
        return { code: 404, message: 'Student is not enrolled in any classroom' }
    }

    if (!studentData.classroom) {
        return { code: 404, message: 'Classroom not active any more' }
    }

    if (!studentData.classroom.classroomCourses || studentData.classroom.classroomCourses.length === 0) {
        return { code: 404, message: 'Classroom of student does not have this standard' }
    }

    return { code: 200, message: 'relation between student and standard found' }
}

const getStudentCurrentStandards = async ({ studentId }) => {
    try {
        const student = await User.findByPk(studentId);
        if (!student) {
            return { code: 404, message: 'Student not found' };
        }

        const currentClassroom = await Classroom.findOne({
            include: [
                {
                    model: ClassroomStudent,
                    as: 'classroomStudents',
                    where: {
                        studentId: studentId,
                    },
                },
                {
                    model: ClassroomCourses,
                    as: 'classroomCourses',
                    include: [{
                        model: Standard,
                        as: 'standard',
                        include: [{
                            model: DailyUpload,
                            as: 'dailyUploads',
                            attributes: ['id'],
                            include: [{
                                model: Resource,
                                as: 'resource',
                                attributes: ['type'],
                            }]
                        }]
                    }],
                }
            ],
            where: {
                status: CLASSROOM_STATUS.ACTIVE
            }
        });

        const summarizedStandards = currentClassroom?.classroomCourses?.map(course => {
            const totalVideoUploads = course.standard.dailyUploads.reduce((count, upload) => {
                return count + (upload.resource.type === 'video' ? 1 : 0);
            }, 0);

            return {
                id: course.standard.id,
                courseLength: course.standard.courseLength,
                name: course.standard.name,
                standardDescription: course.standard.description,
                totalVideoUploads: totalVideoUploads,
                totalNonVideoUploads: course.standard.dailyUploads.length - totalVideoUploads
            };
        });

        return { code: 200, data: summarizedStandards };
    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while fetching standards summaries');
        return { code: 500 };
    }
};

const getStudentVideo = async ({ role, videoId, studentId, standardId }) => {
    try {
        const checkActiveStandardResult = await checkStudentAndStandard({ role, studentId, standardId });
        if (checkActiveStandardResult.code !== 200) {
            return checkActiveStandardResult
        }

        const studentClassroomId = await getClassroomIdOfStudent(studentId);
        if (!studentClassroomId) {
            return { code: 404, message: 'Student is not enrolled in any active classroom' };
        }

        const watchedVideo = await VideoTracking.findOne({
            where: {
                videoId: videoId,
                studentId: studentId,
                standardId: standardId,
                classroomId: studentClassroomId,
            }
        });

        if (watchedVideo) {
            const video = await Video.findOne({
                where: { id: videoId },
                include: [
                    {
                        model: Resource,
                        as: 'resource',
                        attributes: ['name', 'url'],
                    }, 
                    {
                        model: Question,
                        as: 'questions',
                        order: [['popUpTime', 'ASC']],
                        include: [{
                            model: VideoQuestionAnswer,
                            as: 'answers',
                            where: { 
                                userId: studentId,
                                standardId: standardId,
                                classroomId: studentClassroomId
                            },
                            required: false
                        }]
                    }
                ],
                group: ['Video.id', 'resource.id', 'questions.id', 'questions.answers.id'],
                order: [[{ model: Question, as: 'questions' }, 'popUpTime', 'ASC']],
            });

            if (!video) {
                return { code: 404, message: 'Video not found' };
            }

            const transformedQuestions = video.questions.map(question => {
                const { answers, createdAt, updatedAt, videoId, ...questionData } = question.get({ plain: true });
                const transformedAnswers = answers.map(answer => {
                    const { createdAt, updatedAt, userId, questionId, ...answerData } = answer;
                    return answerData;
                });
                return {
                    ...questionData,
                    attempt: transformedAnswers[0]
                };
            });

            const { resource, questions, topics, createdAt, updatedAt, ...videoData } = video.get({ plain: true });

            return {
                code: 200,
                data: {
                    video: { ...videoData, lastSeenTime: watchedVideo.last_seen_time, name: resource.name, videoUrl: resource.url, questions: transformedQuestions, topics }
                }
            };

        } else {
            const video = await Video.findOne({
                where: { id: videoId },
                include: [
                    {
                        model: Resource,
                        as: 'resource',
                        attributes: ['name', 'url'],
                    }, 
                    {
                        model: Question,
                        as: 'questions',
                        order: [['popUpTime', 'ASC']],
                    }
                ],
                group: ['Video.id', 'resource.id', 'questions.id'],
            });

            if (!video) {
                return { code: 404, message: 'Video not found' };
            }

            const { resource, questions, topics, ...videoData } = video.get({ plain: true });

            return {
                code: 200,
                data: {
                    video: { ...videoData, name: resource.name, videoUrl: resource.url, questions, topics }
                }
            };
        }
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while fetching the video');
        return { code: 500 };
    }
}

const storeStudentVideo = async ({ role, videoId, studentId, last_seen_time, standardId }) => {
    try {
        const video = await Video.findByPk(videoId);
        if (!video) {
            return { code: 404, message: 'Video not found' };
        }

        if (compareTimes(last_seen_time, video.duration) > 0) {
            return { code: 400 };
        }

        const checkActiveStandardResult = await checkStudentAndStandard({ role, studentId, standardId });
        if (checkActiveStandardResult.code !== 200) {
            return checkActiveStandardResult
        }

        const studentClassroomId = await getClassroomIdOfStudent(studentId);
        if (!studentClassroomId) {
            return { code: 404, message: 'Student is not enrolled in any active classroom' };
        }

        const existingVideoTracking = await VideoTracking.findOne({
            where: {
                videoId: videoId,
                studentId: studentId,
                standardId: standardId,
                classroomId: studentClassroomId,
            }
        });

        if (existingVideoTracking) {
            await existingVideoTracking.update({
                last_seen_time: last_seen_time
            });

            return { code: 200, data: existingVideoTracking };
        }

        const videotracking = await VideoTracking.create({
            videoId: videoId,
            studentId: studentId,
            last_seen_time: last_seen_time,
            standardId: standardId,
            classroomId: studentClassroomId,
        });

        return { code: 200, data: videotracking };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while storing the video');
        return { code: 500 };
    }
}

const getStudentStandard = async ({ role, standardId, studentId }) => {
    try {
        const checkActiveStandardResult = await checkStudentAndStandard({ role, studentId, standardId });
        if (checkActiveStandardResult.code !== 200) {
            return checkActiveStandardResult;
        }

        const studentClassroomId = await getClassroomIdOfStudent(studentId);
        if (!studentClassroomId) {
            return { code: 404, message: 'Student is not enrolled in any active classroom' };
        }

        const standard = await Standard.findByPk(standardId, {
            include: [{
                model: DailyUpload,
                as: 'dailyUploads',
                attributes: ['accessibleDay', 'dayName'],
                include: [{
                    model: Resource,
                    as: 'resource',
                    attributes: ['id', 'name', 'type', 'topic'],
                    include: [
                        {
                            model: Video,
                            as: 'video',
                            attributes: ['id'],
                            include: [{
                                model: VideoTracking,
                                as: 'videoTrackings',
                                required: false,
                                attributes: ['id', 'watchedCompletely'],
                                where: {
                                    studentId: studentId,
                                    standardId: standardId,
                                    classroomId: studentClassroomId
                                }
                            }]
                        },
                        {
                            model: AssessmentResourcesDetail,
                            as: 'AssessmentResourcesDetail',
                            attributes: ['id', 'totalMarks', 'deadline'],
                        }
                    ]
                }]
            },
            {
                model: ClassroomCourses,
                as: 'classroomCourses',
                where: {
                    standardId: standardId,
                    classroomId: studentClassroomId
                },
                attributes: ['id', 'standardId', 'classroomId', 'startDate'],
            }]
        });

        if (!standard) {
            return { code: 404, message: 'Standard not found' };
        }

        const uploadsByDay = standard.dailyUploads.reduce((result, upload) => {
            const day = upload.accessibleDay;
            if (!result[day]) {
                result[day] = { dayName:upload.dayName, resources: []};
            }
            if (upload.resource) {
                result[day].resources.push(upload.resource);
            }
            return result;
        }, {});

        // Convert the day keys to an array and sort them
        const sortedDays = Object.keys(uploadsByDay).map(day => parseInt(day)).sort((a, b) => a - b);

        // Transform daily uploads based on sorted days
        const transformedDailyUploads = sortedDays.map(day => {
            const { released, date } = isReleased(standard.classroomCourses[0].startDate, day);
            return {
                day: day,
                date: date,
                dayName: uploadsByDay[day].dayName,
                released: released,
                topics: uploadsByDay[day].resources.map(resource => ({
                    resourceId: resource.id,
                    name: resource.name,
                    type: resource.type,
                    topic: resource.topic,
                    videoId: resource.video ? resource.video.id : null,
                    watched: resource.video && resource.video.videoTrackings ? resource.video.videoTrackings.length > 0 : false,
                    completed: resource.video && resource.video.videoTrackings && resource.video.videoTrackings[0] ? resource.video.videoTrackings[0].watchedCompletely : false,
                    canWrite: resource.AssessmentResourcesDetail ? canSubmitAssessment(standard.classroomCourses[0].startDate, day, resource.AssessmentResourcesDetail.deadline) : false
                }))
            };
        });
        
        const result = {
            name: standard.name,
            description: standard.description,
            dailyUploads: transformedDailyUploads
        };

        return { code: 200, data: result };
    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while fetching the standard');
        return { code: 500 };
    }
};


const UpdateStudentVideoCompleted = async ({ role, videoId, studentId, standardId, watchedCompletely, last_seen_time }) => {
    try {
        const video = await Video.findByPk(videoId);
        if (!video) {
            return { code: 404, message: 'Video not found' };
        }

        const checkActiveStandardResult = await checkStudentAndStandard({ role, studentId, standardId });
        if (checkActiveStandardResult.code !== 200) {
            return checkActiveStandardResult
        }

        const studentClassroomId = await getClassroomIdOfStudent(studentId);
        if (!studentClassroomId) {
            return { code: 404, message: 'Student is not enrolled in any active classroom' };
        }

        const videoTracking = await VideoTracking.findOne({
            where: {
                videoId: videoId,
                studentId: studentId,
                standardId: standardId,
                classroomId: studentClassroomId
            }
        });

        if (compareTimes(last_seen_time, video.duration) > 0) {
            return { code: 400 };
        }

        if (!videoTracking) {
            const newVideotracking = await VideoTracking.create({
                videoId: videoId,
                studentId: studentId,
                standardId: standardId,
                last_seen_time: last_seen_time,
                watchedCompletely: watchedCompletely,
                classroomId: studentClassroomId,
            });

            return { code: 200, data: newVideotracking };
        }

        const wasWatchedCompletely = videoTracking.watchedCompletely;

        const updatedVideoTracking = await videoTracking.update({
            watchedCompletely: watchedCompletely,
            last_seen_time: last_seen_time
        });

        // If watchedCompletely is now true and it was not true before, increase finishedResourcesCount
        if (watchedCompletely && !wasWatchedCompletely) {
            await Enrollment.increment('finishedResourcesCount', {
                where: {
                    classroomId: studentClassroomId,
                    studentId: studentId,
                    standardId: standardId
                }
            });
        }

        return { code: 200, data: updatedVideoTracking };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while updating the video tracking');
        return { code: 500 };
    }
}

const UpdateStudentVideoLastSeenTime = async ({ role, videoId, studentId, standardId, last_seen_time }) => {
    try {
        const video = await Video.findByPk(videoId);
        if (!video) {
            return { code: 404, message: 'Video not found' };
        }

        const checkActiveStandardResult = await checkStudentAndStandard({ role, studentId, standardId });
        if (checkActiveStandardResult.code !== 200) {
            return checkActiveStandardResult
        }

        const studentClassroomId = await getClassroomIdOfStudent(studentId);
        if (!studentClassroomId) {
            return { code: 404, message: 'Student is not enrolled in any active classroom' };
        }

        const videoTracking = await VideoTracking.findOne({
            where: {
                videoId: videoId,
                studentId: studentId,
                standardId: standardId,
                classroomId: studentClassroomId
            }
        });

        if (compareTimes(last_seen_time, video.duration) > 0) {
            return { code: 400 };
        }

        if (!videoTracking) {
            const newVideotracking = await VideoTracking.create({
                videoId: videoId,
                studentId: studentId,
                standardId: standardId,
                last_seen_time: last_seen_time,
                classroomId: studentClassroomId,
            });

            return { code: 200, data: newVideotracking };
        }

        const updatedVideoTracking = await videoTracking.update({
            last_seen_time: last_seen_time
        });

        return { code: 200, data: updatedVideoTracking };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while updating the video tracking');
        return { code: 500 };
    }
}

const SaveOrRemoveVideo = async ({ role, videoId, studentId, standardId, save }) => {
    try {
        const video = await Video.findByPk(videoId);
        if (!video) {
            return { code: 404, message: 'Video not found' };
        }

        const checkActiveStandardResult = await checkStudentAndStandard({ role, studentId, standardId });
        if (checkActiveStandardResult.code !== 200) {
            return checkActiveStandardResult
        }

        const studentClassroomId = await getClassroomIdOfStudent(studentId);
        if (!studentClassroomId) {
            return { code: 404, message: 'Student is not enrolled in any active classroom' };
        }

        const existingVideoTracking = await VideoTracking.findOne({
            where: {
                videoId: videoId,
                studentId: studentId,
                standardId: standardId,
                classroomId: studentClassroomId
            }
        });

        if (existingVideoTracking) {
            if (save === true && existingVideoTracking.saved === true) {
                return { code: 409, message: 'Video is already saved' };
            }
            await existingVideoTracking.update({
                saved: save
            });

            return { code: 200, data: existingVideoTracking };
        }

        const videotracking = await VideoTracking.create({
            videoId: videoId,
            studentId: studentId,
            standardId: standardId,
            saved: save,
            classroomId: studentClassroomId,
        });

        return { code: 200, data: videotracking };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while storing the video');
        return { code: 500 };
    }
}

const getSavedVideos = async ({ studentId }) => {
    try {
        const student = await User.findByPk(studentId);
        if (!student) {
            return { code: 404, message: 'Student not found' };
        }

        const studentClassroomId = await getClassroomIdOfStudent(studentId);
        if (!studentClassroomId) {
            return { code: 404, message: 'Student is not enrolled in any active classroom' };
        }

        const data = await Video.sequelize.query(`SELECT  
                                                V."id" AS "videoId",
                                                R."name" AS "name",
                                                VT."last_seen_time" AS "lastSeenTime",
                                                V."thumbnailURL" AS "thumbnailURL",
                                                V."duration" AS "duration",
                                                V."topics" AS "topics",
                                                COUNT(Q."id") AS "questionCount",
                                                DU."accessDate" AS "accessDate",
                                                VT."watchedCompletely" AS "completed",
                                                DU."standardId" AS "standardId"
                                            FROM 
                                                "VideoTrackings" AS VT
                                            INNER JOIN 
                                                "Videos" AS V ON VT."videoId" = V."id"
                                            INNER JOIN 
                                                "Resources" AS R ON V."resourceId" = R."id"
                                            INNER JOIN 
                                                "DailyUploads" AS DU ON DU."resourceId" = V."resourceId" AND DU."standardId" = VT."standardId"
                                            LEFT JOIN 
                                                "Questions" AS Q ON Q."videoId" = V."id"
                                            INNER JOIN 
                                                "ClassroomStudents" AS CS ON CS."studentId" = '${studentId}'
                                            INNER JOIN 
                                                "Classrooms" AS C ON C."id" = CS."classroomId"
                                            INNER JOIN 
                                                "ClassroomCourses" AS CC ON CC."classroomId" = C."id" AND CC."standardId" = DU."standardId"
                                            WHERE 
                                                VT."saved" = true AND '${studentId}' = VT."studentId" AND C."status" = 'active' AND VT."classroomId" = '${studentClassroomId}'
                                            GROUP BY 
                                                V."id", R."name", VT."last_seen_time", V."thumbnailURL", V."duration", DU."accessDate", VT."watchedCompletely", DU."standardId";`
        );

        const transformedData = data[0].map(item => {
            const { topics, ...other } = item;
            const topicCount = Object.keys(topics).length;
            return { ...other, topicCount };
        });

        const groupedVideos = transformedData.reduce((grouped, video) => {
            const date = video.accessDate;
            const index = grouped.findIndex(group => group.date === date);
            if (index === -1) {
                grouped.push({ date, videos: [video] });
            } else {
                grouped[index].videos.push(video);
            }
            return grouped;
        }, []);

        const sortedGroupedVideos = groupedVideos.sort((a, b) => a.date < b.date ? -1 : (a.date > b.date ? 1 : 0));

        return { code: 200, data: sortedGroupedVideos };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while fetching the saved videos');
        return { code: 500 };
    }
}

const getStandardsResourcesAndCount = async ({ studentId, page, limit, orderBy, sortBy }) => {
    try {
        const student = await User.findByPk(studentId);
        if (!student) {
            return { code: 404, message: 'Student not found' };
        }

        const offset = (page - 1) * limit;

        const activeClassroom = await ClassroomStudent.findOne({
            where: {
                studentId: studentId
            },
            include: [{
                model: Classroom,
                as: 'classroom',
                where: { status: CLASSROOM_STATUS.ACTIVE },
                attributes: ['id'],
                include: [{
                    model: ClassroomCourses,
                    as: 'classroomCourses',
                    attributes: ['standardId'],
                }],
            }],
        });

        if (!activeClassroom) {
            return {
                code: 200,
                data: {
                    totalPages: 0,
                    standards: []
                }
            };
        }

        const standardIds = activeClassroom.classroom?.classroomCourses?.map(course => course.standardId);

        const standards = await Standard?.findAll({
            where: { 
                id: standardIds 
            },
            attributes: ['id', 'name'],
            order: [[orderBy, sortBy]],
            offset,
            limit,
            include: [
                {
                    model: DailyUpload,
                    as: 'dailyUploads',
                    attributes: ['id', 'resourceId', 'accessibleDay'],
                    include: [{
                        model: Resource,
                        as: 'resource',
                        attributes: ['id', 'name', 'type', 'topic', 'url'],
                        where: {
                            type: { [Op.ne]: 'video' }
                        },
                    }],
                },{
                    model: ClassroomCourses,
                    as: 'classroomCourses',
                    attributes: ['id', 'startDate'],
                    where: {
                        classroomId: activeClassroom.classroomId
                    },
                }
            ],
        });

        const totalStandardsCount = await Standard.count({
            where: { id: standardIds },
        });

        const transformedData = standards.map(standard => ({
            id: standard.id,
            name: standard.name,
            resourceCount: standard.dailyUploads.length,
            resources: standard.dailyUploads.map(upload => ({
                id: upload.resource.id,
                name: upload.resource.name,
                type: upload.resource.type,
                topic: upload.resource.topic,
                url: upload.resource.url,
                released: isReleased(standard.classroomCourses[0].startDate, upload.accessibleDay),
            }))
        }));

        return {
            code: 200,
            data: {
                totalPages: Math.ceil(totalStandardsCount / limit),
                standards: transformedData
            }
        };
    } catch (error) {
        console.log(error);
        logger.error(error?.message || 'An error occurred while fetching the standard');
        return { code: 500 };
    }
};

const getStudentProfileStandardResults = async ({ role, studentId, standardId }) => {
    try {
        const checkActiveStandardResult = await checkStudentAndStandard({ role, studentId, standardId });
        if (checkActiveStandardResult.code !== 200) {
            return checkActiveStandardResult
        }

        const studentClassroomId = await getClassroomIdOfStudent(studentId);
        if (!studentClassroomId) {
            return { code: 404, message: 'Student is not enrolled in any active classroom' };
        }

        const standard = await Standard.findByPk(standardId, {
            attributes: ['id', 'name', 'description', 'courseLength'],
            include: [{
                model: DailyUpload,
                as: 'dailyUploads',
                attributes: ['id', 'accessibleDay', 'weightage'],
                include: [{
                    model: Resource,
                    as: 'resource',
                    attributes: ['id', 'name', 'type'],
                    where: {
                        type: [
                            RESOURCE_TYPES.VIDEO,
                            RESOURCE_TYPES.WORKSHEET,
                            RESOURCE_TYPES.QUIZ,
                            RESOURCE_TYPES.ASSIGNMENT,
                            RESOURCE_TYPES.FORMATIVE_ASSESSMENT,
                            RESOURCE_TYPES.SUMMARIZE_ASSESSMENT,
                        ]
                    },
                    include: [
                        {
                            model: Video,
                            as: 'video',
                            attributes: ['id'],
                            include: [{
                                model: Question,
                                as: 'questions',
                                attributes: ['id', 'statement', 'totalMarks', 'options', 'correctOption', 'correctOptionExplanation'],
                                required: false,
                                include: [{
                                    model: VideoQuestionAnswer,
                                    as: 'answers',
                                    where: { 
                                        userId: studentId,
                                        standardId: standardId,
                                        classroomId: studentClassroomId
                                    },
                                    attributes: ['obtainedMarks', 'answer'],
                                    required: false
                                }]
                            }]
                        },
                        {
                            model: AssessmentResourcesDetail,
                            as: 'AssessmentResourcesDetail',
                            attributes: ['id', 'totalMarks', 'deadline'],
                            include: [{
                                model: AssessmentAnswer,
                                as: 'assessmentAnswers',
                                where: { 
                                    userId: studentId,
                                    standardId: standardId,
                                    classroomId: studentClassroomId
                                },
                                attributes: ['obtainedMarks', 'answerURL'],
                                required: false,
                                separate: true
                            }]
                        }
                    ]
                }],
            },{
                model: ClassroomCourses,
                as: 'classroomCourses',
                attributes: ['id', 'standardId', 'classroomId', 'startDate'],
                where: {
                    standardId: standardId,
                    classroomId: studentClassroomId
                },
            }],
            order: [
                [{ model: DailyUpload, as: 'dailyUploads' }, 'accessibleDay', 'ASC']
            ],
        });

        // Current date for comparison
        const today = new Date();

        const result = await standard?.get({ plain: true });

        if (!result) {
            return {
                code: 200,
                data: []
            };
        }

        let currentTotalWeightage = 0;
        let currentAcheivedWeightage = 0;
        let totalUnMarkedWeightage = 0;
        let totalunAnsweredWeightage = 0;

        // Add accessible field and calculate performance
        result.dailyUploads = result?.dailyUploads?.map(dailyUpload => {
            dailyUpload.accessible = isReleased(result.classroomCourses[0].startDate, dailyUpload.accessibleDay)

            let totalObtainedMarks = 0;
            let totalPossibleMarks = 0;
            let yetToMarkWeightage = 0;
            let unAnsweredWeightage = 0;


            // Calculate total obtained marks and total possible marks for the video
            if (dailyUpload.resource.video) {
                let unmarkedQuestionsTotal = 0;
                totalPossibleMarks = dailyUpload.resource.video?.questions?.reduce((total, question) => {
                    return total + question.totalMarks;
                }, 0);
                dailyUpload.resource.video?.questions?.forEach(question => {
                    if (!question?.answers || question.answers.length === 0) {
                        unAnsweredWeightage += (question.totalMarks / totalPossibleMarks) * dailyUpload.weightage;
                    }
                    question?.answers?.forEach(answer => {
                        totalObtainedMarks += answer?.obtainedMarks === -1 ? 0 : answer?.obtainedMarks;
                        unmarkedQuestionsTotal += (answer?.obtainedMarks === -1 ? question.totalMarks : 0);
                        yetToMarkWeightage += (unmarkedQuestionsTotal / totalPossibleMarks) * dailyUpload.weightage;
                    });
                });
            }

            // Calculate total obtained marks and total possible marks for the assessment
            if (dailyUpload.resource.AssessmentResourcesDetail) {
                if (!dailyUpload.resource.AssessmentResourcesDetail?.assessmentAnswers || dailyUpload.resource.AssessmentResourcesDetail.assessmentAnswers.length === 0) {
                    unAnsweredWeightage += dailyUpload.weightage;
                }
                dailyUpload.resource.AssessmentResourcesDetail?.assessmentAnswers?.forEach(answer => {
                    totalObtainedMarks += answer?.obtainedMarks === -1 ? 0 : answer?.obtainedMarks;
                    yetToMarkWeightage += (answer?.obtainedMarks === -1 ? dailyUpload.weightage : 0);

                });
                totalPossibleMarks += dailyUpload.resource.AssessmentResourcesDetail?.totalMarks || 0;
            }

            // Calculate performance
            dailyUpload.performance = totalPossibleMarks > 0 ? (totalObtainedMarks / totalPossibleMarks) * dailyUpload.weightage : dailyUpload.weightage;
            dailyUpload.performance = parseFloat(dailyUpload.performance.toFixed(1))
            dailyUpload.yetToMarkWeightage = parseFloat(yetToMarkWeightage.toFixed(1));
            dailyUpload.unAnsweredWeightage = parseFloat(unAnsweredWeightage.toFixed(1));
            totalUnMarkedWeightage += parseFloat(yetToMarkWeightage.toFixed(1));
            totalunAnsweredWeightage += parseFloat(unAnsweredWeightage.toFixed(1));

            if (dailyUpload.accessible) {
                currentTotalWeightage += dailyUpload.weightage;
                currentAcheivedWeightage += dailyUpload.performance;
            }

            return dailyUpload;
        });

        result.currentTotalWeightage = parseFloat(currentTotalWeightage.toFixed(1));
        result.currentAcheivedWeightage = parseFloat(currentAcheivedWeightage.toFixed(1));
        result.totalUnMarkedWeightage = parseFloat(totalUnMarkedWeightage.toFixed(1));
        result.totalunAnsweredWeightage = parseFloat(totalunAnsweredWeightage.toFixed(1));

        return {
            code: 200,
            data: result
        };
    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while fetching the standard');
        return { code: 500 };
    }
};

const getStudentProfileSummarizedStandards = async ({ studentId }) => {
    try {
        const student = await User.findByPk(studentId);
        if (!student) {
            return { code: 404, message: 'Student not found' };
        }

        const studentClassroomId = await getClassroomIdOfStudent(studentId);
        if (!studentClassroomId) {
            return {
                code: 200,
                data: {
                    summarizedStandardResults: [],
                    averageTotalWeightage: 0,
                    averageObtainedWeightage: 0,
                    classroomName: 'N/A',
                    bestPerformingStandard: 'N/A'
                }
            };
        }

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

        // Current date for comparison
        const today = new Date();

        const result = await data?.get({ plain: true });

        if (!result || !result.classroom || !result.classroom.classroomCourses) {
            return {
                code: 200,
                data: [],
            };
        }

        const transformedData = data?.classroom?.classroomCourses?.map(course => {
            const standard = course?.standard;
            let totalWeightage = 0;

            standard?.dailyUploads?.forEach(upload => {
                // Only consider uploads with startDate + accessibleDay < today
                if (isReleased(course.startDate, upload.accessibleDay)) {
                    totalWeightage += upload.weightage;
                }
            })
            return {
                standardId: standard.id,
                standardName: standard.name,
                totalWeightage: parseFloat(totalWeightage.toFixed(1)),
            };
        })

        // Calculate average total weightage
        const totalTotalWeightage = transformedData?.reduce((total, entry) => {
            return total + entry.totalWeightage;
        }, 0);
        const averageTotalWeightage = transformedData?.length > 0 ? totalTotalWeightage / transformedData.length : 0;;

        const classroomName = result.classroom.name;

        const retreivedStandardResults = await sequelize.query(`
            SELECT
                s.id AS standard_id,
                s.name AS standard_name,
                e.result AS obtained_weightage
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
        `);
        const studentClassroomResults = retreivedStandardResults[0];
        // Find worst performing standard
        let bestPerformingStandard = null;
        let bestPerformingWeightage = -1;
        let totalObtainedWeightage = 0;
        let numberOfStandards = 0;

        const summarizedStandardResults = studentClassroomResults?.map(entry => {
            totalObtainedWeightage += entry.obtained_weightage;
            numberOfStandards++;
            if (entry.obtained_weightage > bestPerformingWeightage) {
                bestPerformingWeightage = entry.obtained_weightage;
                bestPerformingStandard = {
                    standardId: entry.standard_id,
                    standardName: entry.standard_name,
                    obtainedWeightage: parseFloat(entry.obtained_weightage.toFixed(1))
                };
            }

            const standard = transformedData.find(standard => standard.standardId === entry.standard_id);

            return {
                standardId: entry.standard_id,
                standardName: entry.standard_name,
                obtainedWeightage: parseFloat(entry.obtained_weightage.toFixed(1)),
                totalWeightage: parseFloat(standard.totalWeightage.toFixed(1))
            }
        });

        return {
            code: 200,
            data: {
                summarizedStandardResults: summarizedStandardResults,
                averageTotalWeightage: parseFloat(averageTotalWeightage.toFixed(1)),
                averageObtainedWeightage: parseFloat((totalObtainedWeightage/numberOfStandards).toFixed(1)),
                classroomName: classroomName,
                bestPerformingStandard: bestPerformingStandard
            }
        };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while fetching the saved videos');
        return { code: 500 };
    }
}

const getSummarizedStudentStandardsForTeacher = async ({ studentId }) => {
    try {
        const student = await User.findByPk(studentId);
        if (!student) {
            return { code: 404, message: 'Student not found' };
        }

        const classroomStudent = await ClassroomStudent.findOne({
            where: {
                studentId: studentId,
            },
            attributes: ['id', 'classroomId'],
            include: {
                model: Classroom,
                as: 'classroom',
                attributes: ['id', 'name'],
                where: {
                    status: CLASSROOM_STATUS.ACTIVE
                },
                required: true
            }
        });
        if (!classroomStudent) {
            return { code: 404, message: 'Student is not enrolled in any active classroom' };
        }

        const classCourses = await ClassroomCourses.findAll({
            where: {
                classroomId: classroomStudent.classroomId,
            },
            attributes: ["id", "standardId", "startDate"],
            include: {
                model: Standard,
                as: 'standard',
                attributes: ["id", "name"],
                include: [
                    {
                        model: Enrollment,
                        where: {
                            studentId: studentId,
                            classroomId: classroomStudent.classroomId
                        },
                        attributes: ["id", "classroomId", "standardId", "result"],
                    },
                    {
                        model: DailyUpload,
                        as: 'dailyUploads',
                        attributes: ['id', 'accessibleDay', 'weightage'],
                        where: {
                            weightage: {
                                [Op.gt]: 0
                            }
                        },
                        required: false,
                    }
                ]
            }
        })

        let allResultsSum = 0;
        let allClassCurrentWeightage = 0;
        let countOfStandards = 0;

        const today = new Date();
        
        const summarizedStandardResults = classCourses?.map(classCourse => {
            const standard = classCourse?.standard;

            // calculate current total weightage of standard up till today
            let currentTotalWeightage = standard?.dailyUploads?.reduce((accumulator, dailyUpload) => {
                const accessibleDate = new Date(classCourse.startDate);
                accessibleDate.setDate(accessibleDate.getDate() + dailyUpload.accessibleDay);
                if (today >= accessibleDate) {
                    return accumulator + dailyUpload.weightage;
                }
                return accumulator;
            }, 0);

            // calculate results of students for class 
            allResultsSum = allResultsSum + standard?.Enrollments[0]?.result;
            countOfStandards = countOfStandards + 1;
            allClassCurrentWeightage = allClassCurrentWeightage + currentTotalWeightage;

            return {
                standardId: standard.id,
                standardName: standard.name,
                totalWeightage: parseFloat(currentTotalWeightage.toFixed(2)),
                obtainedWeightage: parseFloat(standard?.Enrollments[0]?.result.toFixed(2)),
            };
        })

        return {
            code: 200,
            data: {
                summarizedStandardResults: summarizedStandardResults,
                averageTotalWeightage: parseFloat((allClassCurrentWeightage / countOfStandards).toFixed(2)),
                averageObtainedWeightage: parseFloat((allResultsSum / countOfStandards).toFixed(2)),
            }
        };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while fetching the saved videos');
        return { code: 500 };
    }
}

const getSummarizedStudentForTeacher = async ({ studentId }) => {
    try {
        const student = await User.findByPk(studentId);
        if (!student) {
            return { code: 404, message: 'Student not found' };
        }

        const classroomStudent = await ClassroomStudent.findOne({
            where: {
                studentId: studentId,
            },
            attributes: ['id', 'classroomId'],
            include: {
                model: Classroom,
                as: 'classroom',
                attributes: ['id', 'name'],
                where: {
                    status: CLASSROOM_STATUS.ACTIVE
                },
                required: true
            }
        });
        if (!classroomStudent) {
            return { code: 404, message: 'Student is not enrolled in any active classroom' };
        }

        const classCourses = await ClassroomCourses.findAll({
            where: {
                classroomId: classroomStudent.classroomId,
            },
            attributes: ["id", "standardId"],
            include: {
                model: Standard,
                as: 'standard',
                attributes: ["id", "name", "totalResourcesCount"],
                include: [
                    {
                        model: Enrollment,
                        where: {
                            studentId: studentId,
                            classroomId: classroomStudent.classroomId,
                        },
                        attributes: ["id", "classroomId", "standardId", "finishedResourcesCount"],
                    }
                ]
            }
        })
        
        const summarizedStandardResults = classCourses?.map(classCourse => {
            const standard = classCourse?.standard;

            return {
                standardId: standard.id,
                standardName: standard.name,
                totalResources: standard.totalResourcesCount,
                finishedResources: standard.Enrollments[0].finishedResourcesCount,
            };
        })

        const sumOfTotalResources = summarizedStandardResults.reduce((acc, result) => acc + result.totalResources, 0);
        const sumOfFinishedResources = summarizedStandardResults.reduce((acc, result) => acc + result.finishedResources, 0);

        const studentData = {
            name: student.name,
            email: student.email,
            image: student.image,
            classroomName: classroomStudent.classroom.name,
            classroomStudentId: classroomStudent.id,
            totalResourcesCount: sumOfTotalResources,
            finishedResourcesCount: sumOfFinishedResources,
        }

        return {
            code: 200,
            data: {
                student: studentData,
                summarizedStandardResults: summarizedStandardResults,
            }
        };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while fetching the saved videos');
        return { code: 500 };
    }
}

const getStudentNameEmailForTeacher = async ({ studentId }) => {
    try {
        const student = await User.findByPk(studentId);
        if (!student) {
            return { code: 404, message: 'Student not found' };
        }

        const plainStudent = await student.get({ plain: true });

        const { name, email } = plainStudent;

        return {
            code: 200,
            data: {
                student: {
                    name: name,
                    email: email,
                }
            }
        };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while fetching the saved videos');
        return { code: 500 };
    }
}

const assignMarksToStudentAnswer = async ({ targetType, studentId, idsAndMarks, standardId }) => {
    const transaction = await sequelize.transaction();
    try {
        const student = await User.findByPk(studentId);
        if (!student) {
            await transaction.rollback();
            return { code: 404, message: 'Student not found' };
        }

        const standard = await Standard.findByPk(standardId);
        if (!standard) {
            await transaction.rollback();
            return { code: 404, message: 'Standard not found' };
        }

        const results = [];

        if (targetType === 'videoQuestion') {

            let video_Id = '';
            let classroom_Id = '';

            for (const [targetId, marks] of Object.entries(idsAndMarks)) {

                const videoQuestion = await Question.findByPk(targetId);
                if (!videoQuestion) {
                    await transaction.rollback();
                    return { code: 404, message: `Video question with Id: ${targetId} not found` };
                }
                if (marks > videoQuestion.totalMarks) {
                    await transaction.rollback();
                    return { code: 400, message: `Obtained Marks of question: ${videoQuestion.statement} are exceeding Total Marks` };
                }

                const video = await Video.findByPk(videoQuestion.videoId);
                if (!video) {
                    await transaction.rollback();
                    return { code: 404, message: `Video not found` };
                }
                video_Id = video.id; // for updating total sum of answered questions in a video

                const { weightage, classroomId, totalMarks, message } = await getResourceDetails({ resourceType: RESOURCE_TYPES.VIDEO, standardId, studentId, resourceSubcategoryId: video.id })
                if (message){
                    await transaction.rollback();
                    return { code: 400, message: message };
                }

                classroom_Id = classroomId; // for updating total sum of answered questions in a video

                const videoQuestionAnswer = await VideoQuestionAnswer.findOne({
                    where: {
                        userId: studentId,
                        questionId: videoQuestion.id,
                        standardId: standardId,
                        classroomId: classroomId
                    }
                });
                if (!videoQuestionAnswer) {
                    await transaction.rollback();
                    return { code: 404, message: `Answer for: ${videoQuestion.statement} not found` };
                }

                if (videoQuestionAnswer.obtainedMarks > 0) {
                    await Enrollment.decrement('result', {
                        by: videoQuestionAnswer.obtainedMarks/totalMarks * weightage,
                        where: {
                            studentId: studentId,
                            standardId: standardId,
                            classroomId: classroomId, 
                        }
                    });
                }
                await Enrollment.increment('result', {
                    by: marks/totalMarks * weightage,
                    where: {
                        studentId: studentId,
                        standardId: standardId,
                        classroomId: classroomId, 
                    }
                });

                const updatedAnswer = await videoQuestionAnswer.update({ obtainedMarks: marks }, { returning: true, transaction });
                results.push(updatedAnswer);
            }
            const totalObtainedMarks = Object.values(idsAndMarks).reduce((acc, marks) => acc + marks, 0);
            const videoTracking = await VideoTracking.findOne({
                where: {
                    videoId: video_Id,
                    studentId: studentId,
                    standardId: standardId,
                    classroomId: classroom_Id,
                }
            })
            await videoTracking.update({obtainedMarks: totalObtainedMarks})
        }
        else {
            for (const [targetId, marks] of Object.entries(idsAndMarks)) {

                const assessment = await AssessmentResourcesDetail.findByPk(targetId);
                if (!assessment) {
                    await transaction.rollback();
                    return { code: 404, message: `Assessment with Id: ${targetId} not found` };
                }

                const { weightage, classroomId, totalMarks, message } = await getResourceDetails({ resourceType: 'assessment', standardId, studentId, resourceSubcategoryId: assessment.id })
                if (message){
                    await transaction.rollback();
                    return { code: 400, message: message };
                }

                const assessmentAnswer = await AssessmentAnswer.findOne({
                    where: {
                        userId: studentId,
                        assessmentResourcesDetailId: assessment.id,
                        standardId: standardId,
                        classroomId: classroomId,
                    }
                });
                if (!assessmentAnswer) {
                    await transaction.rollback();
                    return { code: 404, message: 'Answer of this Assessment not found' };
                }
                if (marks > assessment.totalMarks) {
                    await transaction.rollback();
                    return { code: 400, message: 'Obtained Marks are exceeding Total Marks' };
                }

                if (assessmentAnswer.obtainedMarks > 0) {
                    await Enrollment.decrement('result', {
                        by: assessmentAnswer.obtainedMarks/totalMarks * weightage,
                        where: {
                            studentId: studentId,
                            standardId: standardId,
                            classroomId: classroomId, 
                        }
                    });
                }
                await Enrollment.increment('result', {
                    by: marks/totalMarks * weightage,
                    where: {
                        studentId: studentId,
                        standardId: standardId,
                        classroomId: classroomId, 
                    }
                });

                const updatedAnswer = await assessmentAnswer.update({ obtainedMarks: marks }, { returning: true, transaction });
                results.push(updatedAnswer);
            }
        }
        await transaction.commit();
        return {
            code: 200,
            data: results
        };

    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while fetching the saved videos');
        await transaction.rollback();
        return { code: 500 };
    }
}

const getStudentAssessmentAnswer = async ({ studentId, assessmentDetailId, standardId }) => {
    try {
        const student = await User.findByPk(studentId);
        if (!student) {
            return { code: 404, message: 'Student not found' };
        }

        const standard = await Standard.findByPk(standardId);
        if (!standard) {
            return { code: 404, message: 'Standard not found' };
        }

        const studentClassroomId = await getClassroomIdOfStudent(studentId);
        if (!studentClassroomId) {
            return { code: 404, message: 'Student is not enrolled in any active classroom' };
        }

        const assessmentAnswer = await AssessmentResourcesDetail.findOne({
            where: {
                id: assessmentDetailId,
            },
            include: [{
                model: AssessmentAnswer,
                as: 'assessmentAnswers',
                where: { 
                    userId: student.id,
                    standardId: standardId,
                    classroomId: studentClassroomId,
                },
                required: true
            }]
        })

        if (!assessmentAnswer) {
            return { code: 404, message: 'Students answer to this assessment not found' };
        }

        return {
            code: 200,
            data: {
                assessmentAnswer
            }
        };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while fetching the saved videos');
        return { code: 500 };
    }
}

const getAllSummarizedStudentAndStandardsForTeacher = async ({ teacherId }) => {
    try {
        const teacher = await User.findByPk(teacherId);
        if (!teacher) {
            return { code: 404, message: 'Teacher not found' };
        }

        const classroomsData = await Classroom.findAll({
            where: { status: CLASSROOM_STATUS.ACTIVE, teacherId: teacherId },
            attributes: ["id", "name"],
            include: {
                model: ClassroomCourses,
                as: 'classroomCourses',
                attributes: ['id'],
                include: {
                    model: Standard,
                    as: 'standard',
                    attributes: ['id', 'totalResourcesCount'],
                }
            }
        });

        const queryResult = await sequelize.query(`
            SELECT
                c.id AS classroom_id,
                c.name AS classroom_name,
                s.id AS standard_id,
                s.name AS standard_name,
                u.id AS student_id,
                u.name AS student_name,
                u.email AS student_email,
                u.image AS student_image,
                cs.id AS classroom_student_id,
                e."finishedResourcesCount" AS total_finished_resources
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
            INNER JOIN
                public."ClassroomStudents" AS cs
                ON u.id = cs."studentId"
            WHERE
                c."teacherId" = '${teacherId}'
            ORDER BY
                u.name ASC
        `);

        // for simplification
        const studentsResults = queryResult[0]; 
    
        // calculate overall class result of each student
        const allStudentsClassResults = new Map();
        studentsResults.forEach(studentResult => {
            const key = studentResult.student_id;
            if (!allStudentsClassResults.has(key)) {
                allStudentsClassResults.set(key, {
                    totalFinishedResources: 0,
                    standardsCount: 0,
                    userId: studentResult.student_id,
                    userName: studentResult.student_name,
                    userEmail: studentResult.student_email,
                    image: studentResult.student_image,
                    userClassroomStudentId: studentResult.classroom_student_id,
                    classId: studentResult.classroom_id,
                    className: studentResult.classroom_name
                });
            }

            let currentstudentResult = allStudentsClassResults.get(key);
            currentstudentResult.totalFinishedResources += studentResult.total_finished_resources;
            currentstudentResult.standardsCount = currentstudentResult.standardsCount + 1;
            allStudentsClassResults.set(key, currentstudentResult);
        });
        
        // Convert the Map to an array
        const allStudentsClassResultsArray = Array.from(allStudentsClassResults.values());

        // Create a map to hold the transformed data
        const classroomMap = new Map();

        // For each classroom
        classroomsData.forEach(classroom => {
            let totalResourcesCount = 0;

            classroom.classroomCourses.forEach(course => {
                totalResourcesCount += course.standard.totalResourcesCount;
            });

            classroomMap.set(classroom.id, {
                classId: classroom.id,
                className: classroom.name,
                totalResourcesCount,
                studentsData: []
            });

            //handle students data and their overall result in class
            const currentClassResults = allStudentsClassResultsArray.filter(studentResult => 
                studentResult.classId === classroom.id
            );
            classroomMap.get(classroom.id).studentsData = currentClassResults.map(result => ({
                userId: result.userId,
                userName: result.userName,
                userEmail: result.userEmail,
                image: result.image,
                userClassroomStudentId: result.userClassroomStudentId,
                totalFinishedResources: result.totalFinishedResources,
                classId: result.classId,
                className: result.className
            }));
        });

        // Convert map to array for logging and returning
        const classroomMapArray = Array.from(classroomMap.entries()).map(([key, value]) => ({
            ...value,
            classId: key
        }));

        return {
            code: 200,
            data: classroomMapArray
        };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while fetching the saved videos');
        return { code: 500 };
    }
}

module.exports = {
    getStudentCurrentStandards,
    getStudentVideo,
    storeStudentVideo,
    getStudentStandard,
    UpdateStudentVideoCompleted,
    UpdateStudentVideoLastSeenTime,
    SaveOrRemoveVideo,
    getSavedVideos,
    getStandardsResourcesAndCount,
    getStudentProfileStandardResults,
    getStudentProfileSummarizedStandards,
    getSummarizedStudentStandardsForTeacher,
    getSummarizedStudentForTeacher,
    getStudentNameEmailForTeacher,
    assignMarksToStudentAnswer,
    getStudentAssessmentAnswer,
    getAllSummarizedStudentAndStandardsForTeacher,
};
