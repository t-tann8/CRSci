import axios from 'axios';

export const getVideosAPI = async ({
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/video/getAllVideos`,
        {
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getVideos'],
            },
        }
    );

    return result;
};

export const createVideoQuestionsAPI = async ({
    videoId,
    questions,
    accessToken,
}: {
    videoId: string;
    questions: {
        statement: string;
        options: { [key: string]: string };
        correctOption: string;
        correctOptionExplanation: string;
        totalMarks: number;
        popUpTime: string;
    }[];
    accessToken: string;
}) => {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/question/createVideoQuestions`,
        {
            videoId,
            questions,
            accessToken,
        }
    );

    return response;
};

export const addTopicsInVideoAPI = async ({
    videoId,
    topics,
    accessToken,
}: {
    videoId: string;
    topics: { [key: string]: string };
    accessToken: string;
}) => {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/video/addTopicsInVideo`,
        {
            videoId,
            topics,
            accessToken,
        }
    );

    return response;
};

export const getVideoAPI = async ({
    accessToken,
    videoId,
}: {
    accessToken: string;
    videoId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/video/getVideo`,
        {
            headers: {
                accesstoken: accessToken,
                videoid: videoId,
            },
            next: {
                tags: ['getVideo'],
            },
        }
    );

    return result;
};

export const updateVideoAPI = async ({
    videoId,
    name,
    thumbnailURL,
    questions,
    topics,
    accessToken,
}: {
    videoId: string;
    name: string;
    thumbnailURL: string;
    questions: {
        statement: string;
        options: { [key: string]: string };
        correctOption: string;
        correctOptionExplanation: string;
        totalMarks: number;
        popUpTime: string;
    }[];
    topics: { [key: string]: string };
    accessToken: string;
}) => {
    const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/video/updateVideo`,
        {
            videoId,
            name,
            thumbnailURL,
            questions,
            topics,
            accessToken,
        }
    );

    return response;
};

export const deleteVideoAPI = async ({
    videoId,
    accessToken,
}: {
    videoId: string;
    accessToken: string;
}) => {
    const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/video/deleteVideo`,
        {
            headers: {
                videoId,
                accessToken,
            },
        }
    );

    return response;
};
