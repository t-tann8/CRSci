const { Sequelize } = require("sequelize");
const { logger } = require("../Logs/logger.js");
// @ts-ignore
const { Resource, Video, Question } = require("../models/index.js");
const { RESOURCE_TYPES } = require("../utils/enumTypes.js");

const getAllVideos = async () => {
    try {
        const videos = await Video.findAll({
            attributes: {
                include: [
                    [Sequelize.fn('COUNT', Sequelize.col('questions.id')), 'questionCount']
                ]
            },
            include: [{
                model: Resource,
                as: 'resource',
                attributes: ['name'],
            }, {
                model: Question,
                as: 'questions',
                attributes: [],
            }],
            group: ['Video.id', 'resource.id'],
        });

        const totalVideos = await Video.count();

        const videosWithResourceName = videos.map(video => {
            const { resource, questionCount, topics, ...videoData } = video.get({ plain: true });
            const topicsCount = Object.keys(topics).length;
            const questionCountNumber = Number(questionCount);
            return { ...videoData, name: resource.name, questionCountNumber, topicsCount };
        });

        if (videos) {
            return { code: 200, data: {videos: videosWithResourceName, totalVideos: totalVideos} };
        } else {
            return { code: 404 };
        }
    } catch (error) {
        logger.error(error?.message || 'An error occurred while getting the videos');
        return { code: 500 };
    }
};

const createVideo = async ({ resourceId, thumbnailURL, topics }) => {
    try {
        const resource = await Resource.findByPk(resourceId);
        if (!resource) {
            return { code: 404 };
        }
        const createdVideo = await Video.create({ resourceId, thumbnailURL, topics });
        return { code: 200, data: createdVideo };
    } catch (error) {
        logger.error(error?.message || 'An error occurred while creating the video');
        return { code: 500 };
    }
};

const createMinimalVideo = async ({ resourceId, thumbnailURL }) => {
    try {
        const resource = await Resource.findByPk(resourceId);
        if (!resource) {
            return { code: 404 };
        }
        const createdVideo = await Video.create({ resourceId, thumbnailURL });
        return { code: 200, data: createdVideo };
    } catch (error) {
        logger.error(error?.message || 'An error occurred while creating the video');
        return { code: 500 };
    }
};

const addTopicsInVideo = async ({ videoId, topics }) => {
    try {
        const video = await Video.findByPk(videoId);
        if (!video) {
            return { code: 404 };
        }
        await video.update({ topics })
        return { code: 200, data: video };
    } catch (error) {
        logger.error(error?.message || 'An error occurred while creating the video');
        return { code: 500 };
    }
};

const deleteVideo = async ({ videoId }) => {
    try {
        const video = await Video.findByPk(videoId);
        if (!video) {
            return { code: 404 };
        }

        const videoResource = await video.getResource();
        const resourceDailyUpload = await videoResource.getDailyUpload();
        if (resourceDailyUpload) {
            return { code: 409 };
        }

        const deletedVideo = await video.destroy();
        await videoResource.destroy();
        return { code: 200, data: deletedVideo };
    } catch (error) {
        console.log(error);
        logger.error(error?.message || 'An error occurred while deleting the video');
        return { code: 500 };
    }
};

const getVideo = async ({ videoId }) => {
    try {
        const video = await Video.findOne({
            where: { id: videoId },
            include: [{
                model: Resource,
                as: 'resource',
                attributes: ['name', 'url'],
            }, {
                model: Question,
                as: 'questions',
                // order: [['popUpTime', 'ASC']],
            }],
            group: ['Video.id', 'resource.id', 'questions.id'],
            order: [[{ model: Question, as: 'questions' }, 'popUpTime', 'ASC']], 
        });

        if (!video) {
            return { code: 404 };
        }

        const { resource, questions, topics, ...videoData } = video.get({ plain: true });

        return {
            code: 200,
            data: {
                video: { ...videoData, name: resource.name, videoUrl: resource.url, questions, topics }
            }
        };
    } catch (error) {
        logger.error(error?.message || 'An error occurred while getting the video details');
        return { code: 500 };
    }
};

const updateVideo = async ({ videoId, name, thumbnailURL, questions, topics }) => {
    try {
        const video = await Video.findByPk(videoId);
        if (!video) {
            return { code: 404 };
        }

        if (thumbnailURL) {
            await video.update( {thumbnailURL} );
        }

        const resource = await video.getResource();
        await resource.update({ name });

        if (questions) {
            // Assuming `video` is your video instance and `questions` is your incoming questions array
            const oldQuestions = await video.getQuestions();
            const oldQuestionIds = oldQuestions.map(q => q.id);
            const incomingQuestionIds = questions.map(q => q.id);

            // Update questions
            const questionsToUpdate = questions.filter(q => q.id && oldQuestionIds.includes(q.id));
            for (let question of questionsToUpdate) {
                await Question.update({ ...question }, { where: { id: question.id } });
            }

            // Delete questions that are not present in the incoming questions
            const questionsToDelete = oldQuestions.filter(q => !incomingQuestionIds.includes(q.id));
            for (let question of questionsToDelete) {
                await question.destroy();
            }

            // Create new questions where incoming id is empty or 0
            const questionsToCreate = questions.filter(q => !q.id || q.id === '');
            const newQuestions = await Question.bulkCreate(questionsToCreate.map(({ id, ...question }) => ({ ...question, videoId: videoId })));

            // Fetch updated questions to recalculate total marks
            const updatedQuestions = await video.getQuestions();

            // Calculate total marks
            const totalMarks = updatedQuestions.reduce((acc, question) => acc + question.totalMarks, 0);

            // Update video's total marks
            await video.update({ totalMarks });
        }

        if (topics) {
            await video.update({ topics });
        }

        return { code: 200, data: video };
    } catch (error) {
        console.log(error)
        logger.error(error?.message || 'An error occurred while updating the video');
        return { code: 500 };
    }
};

module.exports = {
    getAllVideos,
    createVideo,
    addTopicsInVideo,
    deleteVideo,
    getVideo,
    createMinimalVideo,
    updateVideo,
};
