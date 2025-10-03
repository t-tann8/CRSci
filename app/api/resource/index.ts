import axios from 'axios';

export const getResourcesAPI = async ({
    accessToken,
    topic = '',
    type = '',
    page = 1,
    limit = 10,
    orderBy = '',
    sortBy = '',
}: {
    accessToken: string;
    topic: string;
    type: string;
    page: number;
    limit: number;
    orderBy: string;
    sortBy: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/resource/getResources?topic=${topic}&type=${type}&limit=${limit}&page=${page}&orderBy=${orderBy}&sortBy=${sortBy}`,
        {
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getResources'],
            },
        }
    );

    return result;
};

export const deleteResourceAPI = async ({
    accessToken,
    resourceId,
}: {
    accessToken: string;
    resourceId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/resource/deleteResource`,
        {
            headers: {
                accesstoken: accessToken,
                resourceid: resourceId,
            },
            method: 'DELETE',
        }
    );

    return result;
};

export const getResourcesCountAPI = async ({
    accessToken,
    topic,
}: {
    accessToken: string;
    topic: string;
}) => {
    const encodedTopic = encodeURIComponent(topic);
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/resource/getResourcesCount?topic=${encodedTopic}`,
        {
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getResourcesCount'],
            },
        }
    );

    return result;
};

export const createResourceAPI = async ({
    name,
    url,
    type,
    topic,
    accessToken,
    thumbnailURL,
    duration,
    totalMarks,
    deadline,
    onUploadProgress,
}: {
    name: string;
    url: string;
    topic: string;
    type: string;
    accessToken: string;
    thumbnailURL?: string;
    duration?: number;
    totalMarks?: number;
    deadline?: number;
    onUploadProgress: (progressEvent: any) => void;
}) => {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/resource/createResource`,
        {
            name,
            url,
            type,
            topic,
            accessToken,
            thumbnailURL,
            duration,
            totalMarks,
            deadline,
        },
        {
            onUploadProgress,
        }
    );

    return response;
};

export const updateResourceAPI = async ({
    resourceId,
    name,
    type,
    topic,
    accessToken,
    totalMarks,
    deadline,
}: {
    resourceId: string;
    name: string;
    type: string;
    topic: string;
    accessToken: string;
    totalMarks?: number;
    deadline?: number;
}) => {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/resource/updateResource`,
        {
            resourceId,
            name,
            type,
            topic,
            accessToken,
            totalMarks,
            deadline,
        }
    );

    return response;
};

export const getResourceAPI = async ({
    resourceId,
    accessToken,
}: {
    resourceId: string;
    accessToken: string;
}) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/resource/getResource`,
        {
            headers: {
                accesstoken: accessToken,
                resourceid: resourceId,
            },
            next: {
                tags: ['getResource'],
            },
        }
    );

    return response;
};

export const getResourcesByTypeAPI = async ({
    resourceType,
    accessToken,
}: {
    resourceType: string;
    accessToken: string;
}) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/resource/getResourcesByType`,
        {
            headers: {
                accesstoken: accessToken,
                resourcetype: resourceType,
            },
            next: {
                tags: ['getResourcesByType'],
            },
        }
    );

    return response;
};

export const getResourcesByNameAPI = async ({
    resourceName,
    resourceType,
    accessToken,
}: {
    resourceName: string;
    resourceType: string;
    accessToken: string;
}) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/resource/getResourcesByName`,
        {
            headers: {
                accesstoken: accessToken,
                resourcename: resourceName,
                resourcetype: resourceType,
            },
            next: {
                tags: ['getResourcesByName'],
            },
        }
    );

    return response;
};
