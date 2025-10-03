import axios from 'axios';

export const createStandardAPI = async ({
    name,
    description,
    dailyUploads,
    topics,
    accessToken,
}: {
    name: string;
    description: string;
    dailyUploads: {
        topicName: string[];
        resourceId: string;
        accessibleDay: number;
        weightage: number;
        type: string;
    }[];
    topics: { name: string; description: string }[];
    accessToken: string;
}) => {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/standard/createStandard`,
        {
            name,
            description,
            dailyUploads,
            topics,
            accessToken,
        }
    );

    return response;
};

export const getStandardAPI = async ({
    accessToken,
    standardId,
}: {
    accessToken: string;
    standardId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/standard/getStandard`,
        {
            headers: {
                accesstoken: accessToken,
                standardid: standardId,
            },
            next: {
                tags: ['getStandard'],
            },
        }
    );

    return result;
};

export const updateStandardAPI = async ({
    standardId,
    name,
    description,
    dailyUploads,
    topics,
    accessToken,
}: {
    standardId: string;
    name: string;
    description: string;
    dailyUploads: {
        topicName: string[];
        resourceId: string;
        accessibleDay: number;
        weightage: number;
        type: string;
    }[];
    topics: { name: string; description: string }[];
    accessToken: string;
}) => {
    const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/standard/updateStandard`,
        {
            standardId,
            name,
            description,
            dailyUploads,
            topics,
            accessToken,
        }
    );

    return response;
};

export const getAllSummarizedStandardsAPI = async ({
    accessToken,
}: {
    accessToken: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/standard/getAllSummarizedStandards`,
        {
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getAllSummarizedStandards'],
            },
        }
    );

    return result;
};

export const getSummarizedStandardAPI = async ({
    accessToken,
    standardId,
}: {
    accessToken: string;
    standardId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/standard/getSummarizedStandard`,
        {
            headers: {
                accesstoken: accessToken,
                standardid: standardId,
            },
            next: {
                tags: ['getSummarizedStandard'],
            },
        }
    );

    return result;
};

export const getStandardTopicsAPI = async ({
    accessToken,
    standardId,
}: {
    accessToken: string;
    standardId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/standard/getStandardTopics`,
        {
            headers: {
                accesstoken: accessToken,
                standardid: standardId,
            },
            next: {
                tags: ['getStandardTopics'],
            },
        }
    );

    return result;
};

export const getTopicResourcesAPI = async ({
    accessToken,
    standardId,
    topicName,
}: {
    accessToken: string;
    standardId: string;
    topicName: string;
}) => {
    const encodedTopicName = encodeURIComponent(topicName);

    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/standard/getTopicResources?topicName=${encodedTopicName}`,
        {
            headers: {
                accesstoken: accessToken,
                standardid: standardId,
            },
            next: {
                tags: ['getTopicResources'],
            },
        }
    );

    return result;
};

export const deleteStandard = async (
    accessToken: string,
    standardid: string
) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/standard/deleteStandard`,
        {
            method: 'DELETE',
            headers: {
                accesstoken: accessToken,
                standardid,
            },
        }
    );

    return result;
};
