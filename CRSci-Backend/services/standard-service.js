const { Sequelize, Op } = require("sequelize");
const { logger } = require("../Logs/logger.js");
// @ts-ignore
const { sequelize,Standard, DailyUpload, Resource, Video, AssessmentResourcesDetail, ClassroomCourses, Classroom, Topic, TopicDailyUpload, VideoTracking, Enrollment, AssessmentAnswer } = require("../models/index.js");
const { CLASSROOM_STATUS, RESOURCE_TYPES, DAILY_UPLOAD_ACTION } = require("../utils/enumTypes.js");

const updateEnrollments = async (resourceId, action, oldWeightage, newWeightage, transaction) => {
    try {
        let currentDailyUpload = await Resource.findOne({
            where: { 
                id: resourceId 
            },
            include: [{
                model: Video,
                as: 'video',
                attributes: ['id'],
                required: false
            },
            {
                model: AssessmentResourcesDetail,
                as: 'AssessmentResourcesDetail',
                attributes: ['id'],
                required: false
            }],
            transaction,
        });

        if (!currentDailyUpload) {
            return 404;
        }

        if (currentDailyUpload?.video) {
            const videoData = await Video.findOne({
                where: {
                    id: currentDailyUpload.video.id
                },
                include: {
                    model: VideoTracking,
                    as: 'videoTrackings',
                    attributes: ['classroomId', 'standardId', 'studentId', 'obtainedMarks'],
                    where: {
                        watchedCompletely: true
                    }
                },
                transaction,
            });

            if (videoData && videoData?.videoTrackings?.length > 0) {
                await Promise.all(videoData.videoTrackings.map(async tracking => {
                    const enrollment = await Enrollment.findOne({
                        where: {
                            studentId: tracking.studentId,
                            standardId: tracking.standardId,
                            classroomId: tracking.classroomId
                        },
                        transaction,
                    });

                    if (enrollment) {
                        if (action === DAILY_UPLOAD_ACTION.DELETE) {
                            enrollment.result -= oldWeightage * (tracking.obtainedMarks/videoData.totalMarks);
                            enrollment.finishedResourcesCount = Math.max(0, enrollment.finishedResourcesCount - 1);
                        }
                        if (action === DAILY_UPLOAD_ACTION.UPDATE) {
                            enrollment.result -= oldWeightage * (tracking.obtainedMarks/videoData.totalMarks);
                            enrollment.result += newWeightage * (tracking.obtainedMarks/videoData.totalMarks);
                        }
                        if (action === DAILY_UPLOAD_ACTION.CREATE) {
                            enrollment.finishedResourcesCount += 1;
                        }
                        await enrollment.save({ transaction });
                    }
                }));
            }
        }

        if (currentDailyUpload?.AssessmentResourcesDetail) {
            const ardData = await AssessmentResourcesDetail.findOne({
                where: {
                    id: currentDailyUpload.AssessmentResourcesDetail.id,
                },
                include: {
                    model: AssessmentAnswer,
                    as: 'assessmentAnswers',
                    attributes: ['classroomId', 'standardId', 'userId', 'obtainedMarks'],
                },
                transaction,
            });

            if (ardData && ardData?.assessmentAnswers?.length > 0) {
                await Promise.all(ardData.assessmentAnswers.map(async answer => {
                    const enrollment = await Enrollment.findOne({
                        where: {
                            studentId: answer.userId,
                            standardId: answer.standardId,
                            classroomId: answer.classroomId
                        },
                        transaction,
                    });

                    if (enrollment) {
                        if (action === DAILY_UPLOAD_ACTION.DELETE) {
                            enrollment.result -= oldWeightage * (answer.obtainedMarks/ardData.totalMarks);
                            enrollment.finishedResourcesCount = Math.max(0, enrollment.finishedResourcesCount - 1);
                        }
                        if (action === DAILY_UPLOAD_ACTION.UPDATE) {
                            enrollment.result -= oldWeightage * (answer.obtainedMarks/ardData.totalMarks);
                            enrollment.result += newWeightage * (answer.obtainedMarks/ardData.totalMarks);
                        }
                        if (action === DAILY_UPLOAD_ACTION.CREATE) {
                            enrollment.finishedResourcesCount +=  1;
                        }
                        await enrollment.save({ transaction });
                    }
                }));
            }
        }
    } catch (error) {
        console.log('\n\n\n', error)
        throw error; // Re-throw the error to handle it in the transaction scope
    }
}


const createStandard = async ({ name, description, topics, dailyUploads }) => {
    const transaction = await sequelize.transaction();
    try {
        const totalWeightage = dailyUploads.reduce((acc, curr) => acc + Number(curr.weightage), 0);
        if (totalWeightage !== 100) {
            await transaction.rollback();
            return { code: 400, message: `The sum of weightages is ${totalWeightage}, it must be 100` };
        }

        const resourceIdCount = {};
        const duplicates = [];
        let totalResourcesCount = 0;

        dailyUploads.forEach(upload => {
            
            const { resourceId } = upload;
            if ([
                RESOURCE_TYPES.VIDEO,
                RESOURCE_TYPES.WORKSHEET,
                RESOURCE_TYPES.QUIZ,
                RESOURCE_TYPES.ASSIGNMENT,
                RESOURCE_TYPES.FORMATIVE_ASSESSMENT,
                RESOURCE_TYPES.SUMMARIZE_ASSESSMENT
            ].includes(upload.type)) {
                totalResourcesCount++;
            }

            if (resourceIdCount[resourceId]) {
                resourceIdCount[resourceId]++;
                if (resourceIdCount[resourceId] === 2) {
                    duplicates.push(resourceId);
                }
            } else {
                resourceIdCount[resourceId] = 1;
            }
        });

        if (duplicates.length > 0) {
            const duplicateResource = await Promise.all(duplicates.map(async resourceId => {
                const foundResource = await Resource.findByPk(resourceId, { transaction });
                return foundResource.name;
            }));
            await transaction.rollback();
            return { code: 409, message: `The following resources already exist in the standard: ${duplicateResource.join(', ')}`};
        }

        const days = dailyUploads.map(upload => upload.accessibleDay);
        const minDay = Math.min(...days);
        const maxDay = Math.max(...days);

        const dayDiff = Math.abs(maxDay - minDay);
        const courseLength = (dayDiff / 7).toFixed(1) + " week";

        const createdStandard = await Standard.create({ name, description, courseLength, totalResourcesCount }, { transaction });

        const createdTopics = await Promise.all(topics.map(topic => 
            Topic.create({ name: topic.name, description: topic.description, standardId: createdStandard.id }, { transaction })
        ));

        const topicIdMap = createdTopics.reduce((map, topic) => {
            map[topic.name] = topic.id;
            return map;
        }, {});

        const dailyUploadPromises = dailyUploads.map(async upload => {
            const { topicName, type, ...uploadData } = upload;
            const createdDailyUpload = await DailyUpload.create({ ...uploadData, standardId: createdStandard.id }, { transaction });

            // Populate TopicDailyUpload table
            const topicDailyUploadPromises = topicName.map(async topic => {
                const topicId = topicIdMap[topic];
                if (topicId && createdDailyUpload.id) {
                    await TopicDailyUpload.create({ topicId, dailyUploadId: createdDailyUpload.id }, { transaction });
                }
            });
            await Promise.all(topicDailyUploadPromises);

            return createdDailyUpload;
        });

        const createdDailyUploads = await Promise.all(dailyUploadPromises);

        await transaction.commit();

        const standard = {
            ...createdStandard.toJSON(),
            dailyUploads: createdDailyUploads
        };

        return { code: 200, data: standard };
    } catch (error) {
        console.log('\n\n\n', error)
        await transaction.rollback();
        logger.error(error?.message || 'An error occurred while updating the standard');
        return { code: 500 };
    }
};

const updateStandard = async ({ standardId, name, description, topics, dailyUploads }) => {
    const transaction = await sequelize.transaction();
    try {
        const standard = await Standard.findByPk(standardId, { transaction });
        if (!standard) {
            await transaction.rollback();
            return { code: 404, message: "Standard not found" };
        }

        if (topics) {
            const existingTopics = await Topic.findAll({
                where: { standardId: standardId },
                transaction
            });

            const existingTopicsMap = new Map(existingTopics.map(topic => [topic.name, topic]));

            const newTopicsMap = new Map(topics.map(topic => [topic.name, topic]));

            const topicsToDelete = Array.from(existingTopicsMap.keys()).filter(name => !newTopicsMap.has(name));
            const topicsToUpdate = Array.from(existingTopicsMap.keys()).filter(name => newTopicsMap.has(name));
            const topicsToCreate = Array.from(newTopicsMap.keys()).filter(name => !existingTopicsMap.has(name));

            await Promise.all(topicsToDelete.map(async name => {
                const topicToDelete = existingTopicsMap.get(name);
                await topicToDelete.destroy({ transaction });
            }));

            await Promise.all(topicsToUpdate.map(async name => {
                const existingTopic = existingTopicsMap.get(name);
                const newTopic = newTopicsMap.get(name);
                if (JSON.stringify(existingTopic.toJSON()) !== JSON.stringify(newTopic)) {
                    await existingTopic.update(newTopic, { transaction });
                }
            }));

            await Promise.all(topicsToCreate.map(topic => {
                return Topic.create({ ...newTopicsMap.get(topic), standardId }, { transaction })
            }));
        }

        let newDailyUploads = [];
        if (dailyUploads) {
            const totalWeightage = dailyUploads.reduce((acc, curr) => acc + Number(curr.weightage), 0);
            if (totalWeightage !== 100) {
                await transaction.rollback();
                return { code: 400, message: `The sum of weightages is ${totalWeightage}, it must be 100` };
            }

            const resourceIdCount = {};
            const duplicates = [];
            let totalResourcesCount = 0;

            dailyUploads.forEach(upload => {

                const { resourceId } = upload;
                if ([
                    RESOURCE_TYPES.VIDEO,
                    RESOURCE_TYPES.WORKSHEET,
                    RESOURCE_TYPES.QUIZ,
                    RESOURCE_TYPES.ASSIGNMENT,
                    RESOURCE_TYPES.FORMATIVE_ASSESSMENT,
                    RESOURCE_TYPES.SUMMARIZE_ASSESSMENT
                ].includes(upload.type)) {
                    totalResourcesCount++;
                }

                if (resourceIdCount[resourceId]) {
                    resourceIdCount[resourceId]++;
                    if (resourceIdCount[resourceId] === 2) {
                        duplicates.push(resourceId);
                    }
                } else {
                    resourceIdCount[resourceId] = 1;
                }
            });

            if (duplicates.length > 0) {
                const duplicateResource = await Promise.all(duplicates.map(async resourceId => {
                    const foundResource = await Resource.findByPk(resourceId, { transaction });
                    return foundResource.name;
                }));
                await transaction.rollback();
                return { code: 409, message: `The following resources already exist in the standard: ${duplicateResource.join(', ')}`};
            }

            const oldDailyUploads = await DailyUpload.findAll({
                where: { 
                    standardId: standardId, 
                }, 
                transaction
            });

            // Create maps for quick lookup
            const oldUploadsMap = new Map(oldDailyUploads.map(upload => [upload.resourceId, upload]));
            const newUploadsMap = new Map(dailyUploads.map(upload => [upload.resourceId, upload]));

            // Identify resources to delete and update
            const resourcesToDelete = Array.from(oldUploadsMap.keys()).filter(id => !newUploadsMap.has(id));
            const resourcesToUpdate = Array.from(oldUploadsMap.keys()).filter(id => newUploadsMap.has(id));
            const resourcesToCreate = Array.from(newUploadsMap.keys()).filter(id => !oldUploadsMap.has(id));

            // Handle resources to update
            for (const id of resourcesToUpdate) {
                const oldUpload = oldUploadsMap.get(id);
                const newUpload = newUploadsMap.get(id);
                const { topicName, type, ...newUploadWithoutTopicName } = newUpload;
            
                // Perform the updateEnrollments operation
                const updations = await updateEnrollments(id, DAILY_UPLOAD_ACTION.UPDATE, oldUpload.weightage, newUpload.weightage, transaction);
                if (updations === 404) {
                    await transaction.rollback();
                    return { code: 404, message: "Resource not found" };
                }
            
                // Check if any fields have changed that need updating
                if (JSON.stringify(oldUpload.toJSON()) !== JSON.stringify(newUploadWithoutTopicName)) {
                    await oldUpload.update(newUploadWithoutTopicName, { transaction });
                }
            
                const currentDailyUpload = await DailyUpload.findOne({
                    where: { 
                        resourceId: id 
                    },
                    include: [{
                        model: TopicDailyUpload,
                        attributes: ['id'],
                        include: [{
                            model: Topic,
                            attributes: ['name']
                        }]
                    }],
                    transaction
                });
                const existingTopicDailyUploads = currentDailyUpload.TopicDailyUploads;
            
                const existingTopicDailyUploadsMap = new Map(existingTopicDailyUploads.map(tdu => [tdu.Topic.name, tdu]));
                const newTopicTopicDailyUploadsMap = new Map(topicName.map(topic => [topic, topic]));
            
                const topicDailyUploadsToDelete = Array.from(existingTopicDailyUploadsMap.keys()).filter(name => !newTopicTopicDailyUploadsMap.has(name));
                const topicDailyUploadsToCreate = Array.from(newTopicTopicDailyUploadsMap.keys()).filter(name => !existingTopicDailyUploadsMap.has(name));
            
                // Delete old topic associations
                await Promise.all(topicDailyUploadsToDelete.map(async name => {
                    const topicToDelete = existingTopicDailyUploadsMap.get(name);
                    await topicToDelete.destroy({ transaction });
                }));
            
                // Create new topic associations
                await Promise.all(topicDailyUploadsToCreate.map(async name => {
                    const topic = await Topic.findOne({
                        where: { name, standardId: standardId },
                        transaction
                    });
                    if (topic) {
                        await TopicDailyUpload.create({
                            topicId: topic.id,
                            dailyUploadId: currentDailyUpload.id
                        }, { transaction });
                    }
                }));
            }

            // Handle resources to delete
            await Promise.all(resourcesToDelete.map(async id => {
                const oldUpload = oldUploadsMap.get(id);

                const updations = await updateEnrollments(id, DAILY_UPLOAD_ACTION.DELETE, oldUpload.weightage, 0, transaction);
                if (updations === 404) {
                    await transaction.rollback();
                    return { code: 404, message: "Resource not found" };
                }

                await oldUpload.destroy({ transaction });
            }));

            // Handle resources to create
            await Promise.all(
                resourcesToCreate.map(async id => {

                    const upload = newUploadsMap.get(id);
                    // Separate topicName from daily upload
                    const { topicName, type, ...uploadWithoutTopicName } = upload;

                    // Check if resource already exists
                    const updations = await updateEnrollments(id, DAILY_UPLOAD_ACTION.CREATE, 0, upload.weightage, transaction);
                    if (updations === 404) {
                        await transaction.rollback();
                        return { code: 404, message: "Resource not found" };
                    }
                    // Create a daily upload record
                    const createdDailyUpload = await DailyUpload.create(
                        { ...uploadWithoutTopicName, standardId },
                        { transaction }
                    );
                
                    // Create TopicDailyUpload records
                    await Promise.all(
                        topicName.map(async (topic) => {
                            const foundTopic = await Topic.findOne({
                                where: {
                                    name: topic,
                                    standardId: standardId
                                },
                                transaction
                            });
                    
                            if (foundTopic) {
                                await TopicDailyUpload.create({
                                    topicId: foundTopic.id,
                                    dailyUploadId: createdDailyUpload.id
                                }, { transaction });
                            }
                        })
                    );
                })
            );

            const days = dailyUploads.map(upload => upload.accessibleDay);
            const minDay = Math.min(...days);
            const maxDay = Math.max(...days);

            const dayDiff = Math.abs(maxDay - minDay);
            const courseLength = (dayDiff / 7).toFixed(1) + " week";
            await standard.update({ courseLength, totalResourcesCount }, { transaction });
        }

        if (name) {
            await standard.update({ name }, { transaction });
        }

        if (description) {
            await standard.update({ description }, { transaction });
        }

        await transaction.commit();

        const updatedStandard = {
            ...standard.toJSON(),
            dailyUploads: newDailyUploads.map(upload => upload.toJSON())
        };

        return { code: 200, data: updatedStandard };
    } catch (error) {
        console.log('\n\n\n', error)
        await transaction.rollback();
        logger.error(error?.message || 'An error occurred while updating the standard');
        return { code: 500 };
    }
};

const getStandard = async ({ standardId }) => {
    try {
        const existingStandard = await Standard.findByPk(standardId);
        if (!existingStandard) {
            return { code: 404, message: 'Standard not found' };
        }

        const standard = await Standard.findByPk(standardId, {
            include: [{
                model: DailyUpload,
                as: 'dailyUploads',
                attributes: ['accessibleDay', 'weightage', 'dayName'],
                include: [{
                        model: TopicDailyUpload,
                        attributes: ['id'],
                        include: [{
                            model: Topic,
                            attributes: ['name']
                        }]
                    },
                    {
                        model: Resource,
                        as: 'resource',
                        attributes: ['id', 'name', 'type', 'topic', 'url'],
                        include: [{
                            model: Video,
                            as: 'video',
                            attributes: ['id']
                        }, {
                            model: AssessmentResourcesDetail,
                            as: 'AssessmentResourcesDetail',
                            attributes: ['id', 'totalMarks', 'deadline']
                        }]
                }]
            },
            {
                model: Topic,
                attributes: ['id', 'name', 'description'],
            }]
        });

        if (!standard) {
            return { code: 404, message: 'Topic or Daily Upload Resource not found' };
        }

        const topicsDescriptions = standard.Topics.map(topic => ({
            topicName: topic.name,
            description: topic.description
        }));

        const uploadsByDay = {};

        standard.dailyUploads.forEach(dailyUpload => {
            const day = dailyUpload.accessibleDay;
            const dayName = dailyUpload.dayName;
            
            if (!uploadsByDay[day]) {
                const topicName = new Set();
                uploadsByDay[day] = { dayName, topicName, resources: [] };
            }

            // Add the topic names to the Set to ensure uniqueness
            dailyUpload.TopicDailyUploads.forEach(topicDailyUpload => {
                uploadsByDay[day].topicName.add(topicDailyUpload.Topic.name);
            });

            if (dailyUpload.resource) {
                uploadsByDay[day].resources.push({
                    resource: dailyUpload.resource,
                    weightage: dailyUpload.weightage
                });
            }
        });

        const transformedDailyUploads = Object.keys(uploadsByDay).sort().map(day => ({
            accessibleDay: parseInt(day, 10),
            dayName: uploadsByDay[day].dayName,
            topicName: Array.from(uploadsByDay[day].topicName).map(name => ({ value: name })),
            topics: uploadsByDay[day].resources.map(({ resource, weightage }) => ({
                resourceId: resource.id,
                name: resource.name,
                type: resource.type,
                topic: resource.topic,
                videoId: resource.video ? resource.video.id : null,
                weightage: weightage || 0,
                deadline: resource.AssessmentResourcesDetail ? resource.AssessmentResourcesDetail.deadline : null,
                totalMarks: resource.AssessmentResourcesDetail ? resource.AssessmentResourcesDetail.totalMarks : null,
                URL: resource.url
            }))
        }));

        const result = {
            name: standard.name,
            description: standard.description,
            dailyUploads: transformedDailyUploads,
            topicsDescriptions: topicsDescriptions,
        };

        return { code: 200, data: result };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while fetching the standard');
        return { code: 500 };
    }
};

const getAllSummarizedStandards = async () => {
    try {
        const totalStandards = await Standard.count();

        const standards = await Standard.findAll({
            attributes: [
                'id',
                'name',
                'courseLength',
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "DailyUploads" AS "du"
                        INNER JOIN "Resources" AS "r" ON "du"."resourceId" = "r"."id"
                        WHERE "du"."standardId" = "Standard"."id" AND "r"."type" = 'video'
                    )`),
                    'totalVideoUploads'
                ],
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "DailyUploads" AS "du"
                        INNER JOIN "Resources" AS "r" ON "du"."resourceId" = "r"."id"
                        WHERE "du"."standardId" = "Standard"."id" AND "r"."type" != 'video'
                    )`),
                    'totalNonVideoUploads'
                ],
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "Topics"
                        WHERE "Topics"."standardId" = "Standard"."id"
                    )`),
                    'topicCount'
                ]
            ]
        });

        return { code: 200, data: { standardsCount: totalStandards, allStandards: standards } };

    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while getting the summarized standards');
        return { code: 500 };
    }
};

const deleteStandard = async ({ standardId }) => {
    try {
        const exisitingStandard = await Standard.findByPk(standardId);
        if (!exisitingStandard) {
            return { code: 404, message: 'Standard not found' };
        }
        
        await Standard.destroy({ 
            where: {
                id: standardId
            } 
        });
        return { code: 200 };
    } catch (error) {
        logger.error(error?.message || 'An error occurred while deleting the standards');
        return { code: 500 };
    }
};

const getSummarizedStandard = async ({ standardId }) => {
    try {
        const standard = await Standard.findByPk(standardId, {
            attributes: [
                'id',
                'name',
                'courseLength',
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "DailyUploads" AS "du"
                        INNER JOIN "Resources" AS "r" ON "du"."resourceId" = "r"."id"
                        WHERE "du"."standardId" = "Standard"."id" AND "r"."type" = 'video'
                    )`),
                    'totalVideoUploads'
                ],
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "DailyUploads" AS "du"
                        INNER JOIN "Resources" AS "r" ON "du"."resourceId" = "r"."id"
                        WHERE "du"."standardId" = "Standard"."id" AND "r"."type" != 'video'
                    )`),
                    'totalNonVideoUploads'
                ],
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "Topics"
                        WHERE "Topics"."standardId" = "Standard"."id"
                    )`),
                    'topicCount'
                ]
            ]
        });

        return { code: 200, data: standard };

    } catch (error) {
        console.log('\n\n\n\n', error);
        logger.error(error?.message || 'An error occurred while getting the summarized standard');
        return { code: 500 };
    }
}

const getStandardTopics = async ({ standardId }) => {
    try {
        const existingStandard = await Standard.findByPk(standardId);
        if (!existingStandard) {
            return { code: 404, message: 'Standard not found' };
        }

        const standard = await Standard.findByPk(standardId, {
            include: [{
                model: Topic,
                attributes: ['id', 'name', 'description'],
                include: {
                    model: TopicDailyUpload,
                    attributes: ['id'],
                    include: {
                        model: DailyUpload,
                        attributes: ['accessibleDay', 'weightage'],
                        where: {
                            standardId: standardId
                        },
                        include: {
                            model: Resource,
                            as: 'resource',
                            attributes: ['id', 'name', 'type', 'topic', 'url'],
                            include: [{
                                model: Video,
                                as: 'video',
                                attributes: ['id']
                            }, {
                                model: AssessmentResourcesDetail,
                                as: 'AssessmentResourcesDetail',
                                attributes: ['id', 'totalMarks', 'deadline']
                            }]
                        }
                    }
                }
            }]
        });

        if (!standard) {
            return { code: 404, message: 'Topic or Daily Upload Resource not found' };
        }

        const topicResourceCounts = {};
        let totalVideoCount = 0;
        let totalNonVideoCount = 0;

        standard.Topics.forEach(topic => {
            const topicName = topic.name;
            if (!topicResourceCounts[topicName]) {
                topicResourceCounts[topicName] = { videoCount: 0, nonVideoCount: 0 };
            }

            topic.TopicDailyUploads.forEach(topicDailyUpload => {
                const { DailyUpload } = topicDailyUpload;
                if (DailyUpload.resource.video) {
                    topicResourceCounts[topicName].videoCount++;
                    totalVideoCount++;
                } else {
                    topicResourceCounts[topicName].nonVideoCount++;
                    totalNonVideoCount++;
                }
            });
        });

        const topicResourceCountsArray = Object.entries(topicResourceCounts).map(([topicName, counts]) => ({
            topicName,
            ...counts
        }));

        const totalTopics = topicResourceCountsArray.length;

        return { 
            code: 200, 
            data: {
                name: standard.name,
                description: standard.description,
                totalTopics,
                topicResourceCounts: topicResourceCountsArray
            } 
        };
    } catch (error) {
        console.error(error);
        logger.error(error?.message || 'An error occurred while fetching the standard');
        return { code: 500 };
    }
};

const getTopicResources = async ({ standardId, topicName }) => {
    try {
        const existingStandard = await Standard.findByPk(standardId);
        if (!existingStandard) {
            return { code: 404, message: 'Standard not found' };
        }

        const standard = await Standard.findByPk(standardId, {
            include: {
                model: Topic,
                where: { 
                    name: topicName 
                },
                attributes: ['id', 'name', 'description'],
                include: {
                    model: TopicDailyUpload,
                    attributes: ['id'],
                    include: {
                        model: DailyUpload,
                        attributes: ['accessibleDay', 'weightage', 'dayName'],
                        where: {
                            standardId: standardId
                        },
                        include: {
                            model: Resource,
                            as: 'resource',
                            attributes: ['id', 'name', 'type', 'topic', 'url'],
                            include: [{
                                model: Video,
                                as: 'video',
                                attributes: ['id']
                            }, {
                                model: AssessmentResourcesDetail,
                                as: 'AssessmentResourcesDetail',
                                attributes: ['id', 'totalMarks', 'deadline']
                            }]
                        }
                    }
                }
            }
        });

        if (!standard) {
            return { code: 404, message: 'Topic or Daily Upload Resource not found' };
        }


        const topic = standard.Topics[0];

        // Transform the daily uploads by day
        const uploadsByDay = topic.TopicDailyUploads.reduce((result, topicDailyUpload) => {
            const { DailyUpload: dailyUpload } = topicDailyUpload;
            const day = dailyUpload.accessibleDay;
            const dayName = dailyUpload.dayName;

            if (!result[day]) {
                result[day] = { dayName, topicName: topic.name, resources: [] };
            }

            if (dailyUpload.resource) {
                result[day].resources.push({ resource: dailyUpload.resource, weightage: dailyUpload.weightage });
            }
            return result;
        }, {});

        const transformedDailyUploads = Object.keys(uploadsByDay).sort().map(day => ({
            day: parseInt(day, 10),
            dayName: uploadsByDay[day].dayName,
            topicName: topicName,
            topics: uploadsByDay[day].resources.map(({ resource, weightage }) => ({
                resourceId: resource.id,
                name: resource.name,
                type: resource.type,
                topic: resource.topic,
                videoId: resource.video ? resource.video.id : null,
                weightage: weightage || 0,
                deadline: resource.AssessmentResourcesDetail ? resource.AssessmentResourcesDetail.deadline : null,
                totalMarks: resource.AssessmentResourcesDetail ? resource.AssessmentResourcesDetail.totalMarks : null,
                URL: resource.url
            }))
        }));

        const result = {
            name: topic.name,
            description: topic.description,
            dailyUploads: transformedDailyUploads,
        };

        return { code: 200, data: result };
    } catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while fetching the standard');
        return { code: 500 };
    }
};

const getStandardClassroomsAndTeacherClassrooms = async ({ standardId, teacherId }) => {
    try {
        const standard = await Standard.findByPk(standardId);
        if (!standard) {
            return { code: 404, message: 'Standard not found' };
        }

        const classCourses = await ClassroomCourses.findAll({
            where: { 
                standardId 
            },
            attributes: ['id', 'startDate'],
            include: [{
                model: Classroom,
                as: 'classroom',
                attributes: ['id', 'name']
            }]
        }); 

        const transformedClassCourses = classCourses?.map(course => ({
            id: course.id,
            startDate: course.startDate,
            classroomId: course.classroom.id,
            classroomName: course.classroom.name
        }));

        const teacherClassrooms = await Classroom.findAll({
            where: { 
                teacherId: teacherId,
                status: CLASSROOM_STATUS.ACTIVE
            },
            attributes: ['id', 'name']
        });

        const options = teacherClassrooms?.map(classroom => {
            return { label: classroom.id, value: classroom.name };
        });

        return { 
            code: 200, 
            data: { 
                standard, 
                classCourses: transformedClassCourses || [], 
                options 
            } 
        };
    }
    catch (error) {
        console.log('\n\n\n\n', error)
        logger.error(error?.message || 'An error occurred while fetching the standard classrooms');
        return { code: 500 };
    }
}
module.exports = {
    createStandard,
    updateStandard,
    getStandard,
    getAllSummarizedStandards,
    deleteStandard,
    getSummarizedStandard,
    getStandardTopics,
    getTopicResources,
    getStandardClassroomsAndTeacherClassrooms
};