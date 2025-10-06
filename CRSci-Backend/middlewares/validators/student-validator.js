const Joi = require('joi');
const { logger } = require("../../Logs/logger");
const { handleInternalServerError, handleErrorResponse } = require('../../utils/response-handlers');

const createSchemaMiddleware = (schema, target = 'body') => async (req, res, next) => {
    try {
        const { error } = schema.validate(req[target]);
        if (error) {
            return handleErrorResponse(res, 400, error.details[0].message);
        }
        next();
    } catch (error) {
        logger.error(error?.message || 'An error occurred, but no error message was provided');
        handleInternalServerError(res);
    }
};

const getStudentCurrentStandards = createSchemaMiddleware(
    Joi.object({
        studentid: Joi.string().guid().required(),
        accesstoken: Joi.string().required()
    }).unknown(), 'headers'
);

const getStudentVideo = createSchemaMiddleware(
    Joi.object({
        videoid: Joi.string().guid().required(),
        studentid: Joi.string().guid().required(),
        standardid: Joi.string().guid().required(),
        accesstoken: Joi.string().required()
    }).unknown(), 'headers'
);

const storeStudentVideo = createSchemaMiddleware(
    Joi.object({
        videoId: Joi.string().guid().required(),
        studentId: Joi.string().guid().required(),
        standardId: Joi.string().guid().required(),
        last_seen_time: Joi.string().pattern(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/).required().messages({
            'string.pattern.base': 'last_seen_time must be in the format HH:MM:SS',
        }),
        accessToken: Joi.string().required()
    })
);

const getStudentStandard = createSchemaMiddleware(
    Joi.object({
        standardid: Joi.string().guid().required(),
        studentid: Joi.string().guid().required(),
        accesstoken: Joi.string().required()
    }).unknown(), 'headers'
);

const UpdateStudentVideoCompleted = createSchemaMiddleware(
    Joi.object({
        videoId: Joi.string().guid().required(),
        studentId: Joi.string().guid().required(),
        standardId: Joi.string().guid().required(),
        watchedCompletely: Joi.boolean().required(),
        last_seen_time: Joi.string().pattern(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/).required().messages({
            'string.pattern.base': 'last_seen_time must be in the format HH:MM:SS',
        }),
        accessToken: Joi.string().required()
    })
);

const UpdateStudentVideoLastSeenTime = createSchemaMiddleware(
    Joi.object({
        videoId: Joi.string().guid().required(),
        studentId: Joi.string().guid().required(),
        standardId: Joi.string().guid().required(),
        last_seen_time: Joi.string().pattern(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/).required().messages({
            'string.pattern.base': 'last_seen_time must be in the format HH:MM:SS',
        }),
        accessToken: Joi.string().required()
    })
);

const SaveOrRemoveVideo = createSchemaMiddleware(
    Joi.object({
        videoId: Joi.string().guid().required(),
        studentId: Joi.string().guid().required(),
        standardId: Joi.string().guid().required(),
        save: Joi.boolean().required(),
        accessToken: Joi.string().required()
    })
);

const getSavedVideos = createSchemaMiddleware(
    Joi.object({
        studentid: Joi.string().guid().required(),
        accesstoken: Joi.string().required()
    }).unknown(), 'headers'
);

const getStandardsResourcesAndCount = createSchemaMiddleware(
    Joi.object({
        studentid: Joi.string().guid().required(),
        accesstoken: Joi.string().required(),
        page: Joi.number().integer().min(1).required(), 
        limit: Joi.number().integer().min(1).required(),
        orderby: Joi.string().valid('name', '').optional(),
        sortby: Joi.string().valid('asc', 'desc', '').optional(),
    }).unknown(), 'headers'
);

const getStudentProfileStandardResults = createSchemaMiddleware(
    Joi.object({
        studentid: Joi.string().guid().required(),
        standardid: Joi.string().guid().required(),
        accesstoken: Joi.string().required(),
    }).unknown(), 'headers'
);

const getStudentProfileSummarizedStandards = createSchemaMiddleware(
    Joi.object({
        studentid: Joi.string().guid().required(),
        accesstoken: Joi.string().required(),
    }).unknown(), 'headers'
);

const getSummarizedStudentStandardsForTeacher = createSchemaMiddleware(
    Joi.object({
        studentid: Joi.string().guid().required(),
        accesstoken: Joi.string().required(),
    }).unknown(), 'headers'
);

const getSummarizedStudentForTeacher = createSchemaMiddleware(
    Joi.object({
        studentid: Joi.string().guid().required(),
        accesstoken: Joi.string().required(),
    }).unknown(), 'headers'
);

const getStudentNameEmailForTeacher = createSchemaMiddleware(
    Joi.object({
        studentid: Joi.string().guid().required(),
        accesstoken: Joi.string().required(),
    }).unknown(), 'headers'
);

const marksSchema = Joi.object().pattern(
    Joi.string().uuid(),
    Joi.number().integer().min(0).required()
).messages({
    'object.pattern.key': 'Each ID must be a valid UUID.',
    'number.base': 'Marks must be a whole number.',
    'number.integer': 'Marks must be a whole number.',
    'number.min': 'Marks must be 0 or greater.',
});
const assignMarksToStudentAnswer = createSchemaMiddleware(
    Joi.object({
        accessToken: Joi.string().required(),
        targetType: Joi.string().valid('videoQuestion', 'assessmentResource').required(), 
        studentId: Joi.string().guid().required(),
        idsAndMarks: marksSchema.required(),
        standardId: Joi.string().guid().required(),
    })
);

const getStudentAssessmentAnswer = createSchemaMiddleware(
    Joi.object({
        studentid: Joi.string().guid().required(),
        assessmentdetailid: Joi.string().guid().required(),
        standardid: Joi.string().guid().required(),
        accesstoken: Joi.string().required(),
    }).unknown(), 'headers'
);

const getAllSummarizedStudentAndStandardsForTeacher = createSchemaMiddleware(
    Joi.object({
        teacherid: Joi.string().guid().required(),
        accesstoken: Joi.string().required(),
    }).unknown(), 'headers'
);

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
    // getAllSummarizedStudentAndStandardsForTeacherV2
};
