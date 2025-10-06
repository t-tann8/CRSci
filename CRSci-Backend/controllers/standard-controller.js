const standardService = require("../services/standard-service.js");
const { handleInternalServerError, handleSuccessResponse, handleErrorResponse } = require("../utils/response-handlers.js")

const createStandard = async (req, res) => {
    try {
        const { name, description, topics, dailyUploads } = req.body;

        const reply = await standardService.createStandard({ name, description, topics, dailyUploads });

        if (reply.code == 200) {
            return handleSuccessResponse(res, 200, reply.data);
        }
        else if (reply.code == 400) {
            return handleErrorResponse(res, 400, reply.message);
        }
        else if (reply.code == 409) {
            return handleErrorResponse(res, 409, reply.message);
        }
        else {
            return handleInternalServerError(res);
        }
    }
    catch (error) {
        return handleInternalServerError(res);
    }
};

const updateStandard = async (req, res) => {
    try {
        const { standardId, name, description, topics, dailyUploads } = req.body;

        const reply = await standardService.updateStandard({ standardId, name, description, topics, dailyUploads });

        if (reply.code == 200) {
            return handleSuccessResponse(res, 200, reply.data);
        }
        else if (reply.code == 400) {
            return handleErrorResponse(res, 400, reply.message);
        }
        else if (reply.code == 404) {
            return handleErrorResponse(res, 404, reply.message);
        }
        if (reply.code == 409) {
            return handleErrorResponse(res, 409, reply.message);
        }
        else {
            return handleInternalServerError(res);
        }
    }
    catch (error) {
        return handleInternalServerError(res);
    }
};

const getStandard = async (req, res) => {
    try {
        const { standardid } = req.headers;

        const reply = await standardService.getStandard({ standardId: standardid });

        if (reply.code == 200) {
            return handleSuccessResponse(res, 200, reply.data);
        }
        else if (reply.code == 404) {
            return handleErrorResponse(res, 404, "Standard not found");
        }
        else {
            return handleInternalServerError(res);
        }
    }
    catch (error) {
        return handleInternalServerError(res);
    }
};

const getAllSummarizedStandards = async (req, res) => {
    try {
        const reply = await standardService.getAllSummarizedStandards();

        if (reply.code == 200) {
            return handleSuccessResponse(res, 200, reply.data);
        }
        else {
            return handleInternalServerError(res);
        }
    }
    catch (error) {
        return handleInternalServerError(res);
    }
};

const deleteStandard = async (req, res) => {
    try {
        const { standardid } = req.headers;

        const reply = await standardService.deleteStandard({ standardId: standardid });

        if (reply.code == 200) {
            return handleSuccessResponse(res, 200, reply.data);
        }
        else if (reply.code == 404) {
            return handleErrorResponse(res, 404, reply.message);
        }
        else {
            return handleInternalServerError(res);
        }
    }
    catch (error) {
        return handleInternalServerError(res);
    }
}

const getSummarizedStandard = async (req, res) => {
    try {
        const { standardid } = req.headers;

        const reply = await standardService.getSummarizedStandard({ standardId: standardid });

        if (reply.code == 200) {
            return handleSuccessResponse(res, 200, reply.data);
        }
        else if (reply.code == 404) {
            return handleErrorResponse(res, 404, "Standard not found");
        }
        else {
            return handleInternalServerError(res);
        }
    }
    catch (error) {
        return handleInternalServerError(res);
    }
};

const getStandardTopics = async (req, res) => {
    try {
        const { standardid } = req.headers;

        const reply = await standardService.getStandardTopics({ standardId: standardid });

        if (reply.code == 200) {
            return handleSuccessResponse(res, 200, reply.data);
        }
        else if (reply.code == 404) {
            return handleErrorResponse(res, 404, "Standard not found");
        }
        else {
            return handleInternalServerError(res);
        }
    }
    catch (error) {
        return handleInternalServerError(res);
    }
}

const getTopicResources = async (req, res) => {
    try {
        const { standardid } = req.headers;
        const { topicName } = req.query;

        const decodedTopicName = decodeURIComponent(topicName);

        const reply = await standardService.getTopicResources({ standardId: standardid, topicName: decodedTopicName });

        if (reply.code == 200) {
            return handleSuccessResponse(res, 200, reply.data);
        }
        else if (reply.code == 404) {
            return handleErrorResponse(res, 404, reply.message);
        }
        else {
            return handleInternalServerError(res);
        }
    }
    catch (error) {
        return handleInternalServerError(res);
    }
}

const getStandardClassroomsAndTeacherClassrooms = async (req, res) => {
    try {
        const { standardid, teacherid } = req.headers;

        const reply = await standardService.getStandardClassroomsAndTeacherClassrooms({ standardId: standardid, teacherId: teacherid });

        if (reply.code == 200) {
            return handleSuccessResponse(res, 200, reply.data);
        }
        else if (reply.code == 404) {
            return handleErrorResponse(res, 404, "Standard not found");
        }
        else {
            return handleInternalServerError(res);
        }
    }
    catch (error) {
        return handleInternalServerError(res);
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
