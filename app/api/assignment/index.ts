import axios from 'axios';

export const getAssessmentAnswerToCreateOrEditAPI = async ({
    accessToken,
    userId,
    resourceId,
    standardId,
}: {
    accessToken: string;
    userId: string;
    resourceId: string;
    standardId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/assessmentAnswer/getAssessmentAnswerToCreateOrEdit`,
        {
            headers: {
                accesstoken: accessToken,
                userid: userId,
                resourceid: resourceId,
                standardid: standardId,
            },
            next: {
                tags: ['getAssessmentAnswerToCreateOrEdit'],
            },
        }
    );

    return result;
};

export const createAssessmentAnswerAPI = async ({
    accessToken,
    userId,
    resourceId,
    standardId,
    answerURL,
}: {
    accessToken: string;
    userId: string;
    resourceId: string;
    standardId: string;
    answerURL: string;
}) => {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/assessmentAnswer/createAssessmentAnswer`,
        {
            accessToken,
            userId,
            resourceId,
            standardId,
            answerURL,
        }
    );

    return response;
};
