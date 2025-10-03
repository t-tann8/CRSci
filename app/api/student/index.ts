import axios from 'axios';

export const getStudentCurrentStandardsAPI = async ({
    accessToken,
    studentId,
}: {
    accessToken: string;
    studentId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/getStudentCurrentStandards`,
        {
            headers: {
                accesstoken: accessToken,
                studentid: studentId,
            },
            next: {
                tags: ['getStudentCurrentStandards'],
            },
        }
    );

    return result;
};

export const getStudentStandardAPI = async ({
    accessToken,
    standardId,
    studentId,
}: {
    accessToken: string;
    standardId: string;
    studentId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/getStudentStandard`,
        {
            headers: {
                accesstoken: accessToken,
                standardid: standardId,
                studentid: studentId,
            },
            next: {
                tags: ['getStudentStandard'],
            },
        }
    );

    return result;
};

export const getStudentVideoAPI = async ({
    accessToken,
    videoId,
    studentId,
    standardId,
}: {
    accessToken: string;
    videoId: string;
    studentId: string;
    standardId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/getStudentVideo`,
        {
            headers: {
                accesstoken: accessToken,
                videoid: videoId,
                studentid: studentId,
                standardid: standardId,
            },
            next: {
                tags: ['getStudentVideo'],
            },
        }
    );

    return result;
};

export const UpdateStudentVideoCompletedAPI = async ({
    accessToken,
    studentId,
    videoId,
    lastSeenTime,
    watchedCompletely,
    standardId,
}: {
    accessToken: string;
    studentId: string;
    videoId: string;
    lastSeenTime: string;
    watchedCompletely: boolean;
    standardId: string;
}) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/UpdateStudentVideoCompleted`,
        {
            accessToken,
            studentId,
            videoId,
            last_seen_time: lastSeenTime,
            watchedCompletely,
            standardId,
        }
    );

    return result;
};

export const UpdateStudentVideoLastSeenTime = async ({
    accessToken,
    studentId,
    videoId,
    lastSeenTime,
    standardId,
}: {
    accessToken: string;
    studentId: string;
    videoId: string;
    lastSeenTime: string;
    standardId: string;
}) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/UpdateStudentVideoLastSeenTime`,
        {
            accessToken,
            studentId,
            videoId,
            last_seen_time: lastSeenTime,
            standardId,
        }
    );

    return result;
};

export const createVideoQuestionAnswerAPI = async ({
    accessToken,
    userId,
    questionId,
    answer,
    standardId,
}: {
    accessToken: string;
    userId: string;
    questionId: string;
    answer: string;
    standardId: string;
}) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/videoQuestionAnswer/createVideoQuestionAnswer`,
        {
            accessToken,
            userId,
            questionId,
            answer,
            standardId,
        }
    );

    return result;
};

export const getSavedVideosAPI = async ({
    accessToken,
    studentId,
}: {
    accessToken: string;
    studentId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/getSavedVideos`,
        {
            headers: {
                accesstoken: accessToken,
                studentid: studentId,
            },
            next: {
                tags: ['getSavedVideos'],
            },
        }
    );

    return result;
};

export const SaveOrRemoveVideoAPI = async ({
    accessToken,
    standardId,
    studentId,
    videoId,
    save,
}: {
    standardId: string;
    accessToken: string;
    studentId: string;
    videoId: string;
    save: boolean;
}) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/SaveOrRemoveVideo`,
        {
            accessToken,
            standardId,
            studentId,
            videoId,
            save,
        }
    );

    return result;
};

export const getStandardsResourcesAndCountAPI = async ({
    accessToken,
    studentId,
    page,
    limit,
}: {
    accessToken: string;
    studentId: string;
    page: string;
    limit: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/getStandardsResourcesAndCount`,
        {
            headers: {
                accesstoken: accessToken,
                studentid: studentId,
                page,
                limit,
            },
            next: {
                tags: ['getStandardsResourcesAndCount'],
            },
        }
    );

    return result;
};

export const getStudentProfileStandardResultsAPI = async ({
    accessToken,
    studentId,
    standardId,
}: {
    accessToken: string;
    studentId: string;
    standardId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/getStudentProfileStandardResults`,
        {
            headers: {
                accesstoken: accessToken,
                studentid: studentId,
                standardid: standardId,
            },
            next: {
                tags: ['getStudentProfileStandardResults'],
            },
        }
    );

    return result;
};

export const getStudentProfileSummarizedStandardsAPI = async ({
    accessToken,
    studentId,
}: {
    accessToken: string;
    studentId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/getStudentProfileSummarizedStandards`,
        {
            headers: {
                accesstoken: accessToken,
                studentid: studentId,
            },
            next: {
                tags: ['getStudentProfileSummarizedStandards'],
            },
        }
    );

    return result;
};

export const getSummarizedStudentStandardsForTeacherAPI = async ({
    accessToken,
    studentId,
}: {
    accessToken: string;
    studentId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/getSummarizedStudentStandardsForTeacher`,
        {
            headers: {
                accesstoken: accessToken,
                studentid: studentId,
            },
            next: {
                tags: ['getSummarizedStudentStandardsForTeacher'],
            },
        }
    );

    return result;
};

export const getStudentNameEmailForTeacherAPI = async ({
    accessToken,
    studentId,
}: {
    accessToken: string;
    studentId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/getStudentNameEmailForTeacher`,
        {
            headers: {
                accesstoken: accessToken,
                studentid: studentId,
            },
            next: {
                tags: ['getStudentNameEmailForTeacher'],
            },
        }
    );

    return result;
};

export const assignMarksToStudentAnswerAPI = async ({
    accessToken,
    studentId,
    targetType,
    idsAndMarks,
    standardId,
}: {
    accessToken: string;
    studentId: string;
    targetType: string;
    idsAndMarks: {
        [key: string]: number;
    };
    standardId: string;
}) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/assignMarksToStudentAnswer`,
        {
            accessToken,
            studentId,
            targetType,
            idsAndMarks,
            standardId,
        }
    );

    return result;
};

export const getStudentAssessmentAnswerAPI = async ({
    accessToken,
    studentId,
    assesmentResourceId,
    standardId,
}: {
    accessToken: string;
    studentId: string;
    assesmentResourceId: string;
    standardId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/getStudentAssessmentAnswer`,
        {
            headers: {
                accesstoken: accessToken,
                studentid: studentId,
                assessmentdetailid: assesmentResourceId,
                standardid: standardId,
            },
            next: {
                tags: ['getStudentAssessmentAnswer'],
            },
        }
    );

    return result;
};

export const getSummarizedStudentForTeacherAPI = async ({
    accessToken,
    studentId,
}: {
    accessToken: string;
    studentId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/getSummarizedStudentForTeacher`,
        {
            headers: {
                accesstoken: accessToken,
                studentid: studentId,
            },
            next: {
                tags: ['getSummarizedStudentForTeacher'],
            },
        }
    );

    return result;
};

export const SummarizedStudentsAPI = async ({
    teacherId,
    accessToken,
}: {
    teacherId: string;
    accessToken: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/getAllSummarizedStudentAndStandardsForTeacher`,
        {
            headers: {
                accesstoken: accessToken,
                teacherid: teacherId,
            },
            next: {
                tags: ['SummarizedStudents'],
            },
        }
    );
    const response = await result.json();

    return response;
};
