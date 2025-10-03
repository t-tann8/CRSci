import axios from 'axios';

export const getSchoolProfileAPI = async (accessToken: string) => {
    const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/school/getSchoolProfile`,
        {
            headers: {
                accesstoken: accessToken,
            },
        }
    );

    return result;
};

export const updateSchoolAndUserProfile = async (
    accessToken: string,
    image: string,
    username: string,
    email: string,
    password: string,
    schoolName: string,
    numOfClasses: number,
    classesStart: number,
    classesEnd: number
) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/school/updateSchoolAndUserProfile`,
        {
            accessToken,
            image,
            username,
            email,
            password,
            schoolName,
            numOfClasses,
            classesStart,
            classesEnd,
        }
    );

    return result;
};

export const getAllSchoolsAPI = async (accessToken: string) => {
    const reuslt = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/school/getAllSchools`,
        {
            headers: {
                accesstoken: accessToken,
            },
        }
    );
    return reuslt;
};

export const createSchoolAPI = async (
    token: string,
    name: string,
    email: string,
    schoolName: string,
    password: string
) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/school/create-school/${token}`,
            {
                method: 'POST', // Specify the HTTP method
                headers: {
                    'Content-Type': 'application/json', // Ensure the data is sent as JSON
                },
                body: JSON.stringify({
                    name,
                    email,
                    schoolName,
                    password,
                }),
            }
        );

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating school:', error);
        throw new Error('Failed to create school');
    }
};

export const getSchoolDashboardAPI = async (
    accessToken: string,
    schoolId: string,
    userId: string
) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/school/get-school-dashboard?schoolId=${schoolId}&userId=${userId}`,
        {
            method: 'GET',
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getSchoolDashboard'],
            },
        }
    );
    const response = await result.json();
    return response;
};

export const createTicketAPI = async (
    accessToken: string,
    userId: string,
    complaintType: string,
    message: string
) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/school/create-ticket`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accesstoken: accessToken,
            },
            body: JSON.stringify({
                userId,
                complaintType,
                message,
            }),
        }
    );
    const response = await result.json();
    return response;
};

export const getListTeacherOfSchool = async ({
    accessToken,
    schoolId,
    page,
    limit,
    search,
}: {
    accessToken: string;
    schoolId: string;
    page: string;
    limit: number;
    search?: string;
}) => {
    const queryParams = new URLSearchParams({
        schoolId,
        page,
        limit: limit.toString(),
        ...(search ? { search } : {}),
    }).toString();

    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/school/list-teacher?${queryParams}`,
        {
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getListTeacherOfSchool'],
            },
        }
    );

    return result;
};

export const getTeacherDetailsAPI = async (
    accessToken: string,
    teacherId: string
) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/school/get-teacher?teacherId=${teacherId}`,
        {
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getTeacherDetailsAPI'],
            },
        }
    );

    const response = await result.json();
    return response;
};

export const deleteTeacherAPI = async (
    accessToken: string,
    teacherId: string
) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/school/delete-teacher?teacherId=${teacherId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                accesstoken: accessToken,
            },
        }
    );

    const response = await result.json();
    return response;
};

export const getSchoolCoursesAPI = async ({
    accessToken,
    schoolId,
}: {
    accessToken: string;
    schoolId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/school/get-courses?schoolId=${schoolId}`,
        {
            method: 'GET',
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getSchoolCourses'],
            },
        }
    );

    return result;
};

export const getSchoolStandardResourcesAPI = async ({
    accessToken,
    standardId,
}: {
    accessToken: string;
    standardId: string;
}) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/school/get-courses-content?standardId=${standardId}`,
        {
            method: 'GET',
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getSchoolStandardResources'],
            },
        }
    );

    return result;
};

export const getSchoolResourceResultsAPI = async (
    accessToken: string,
    schoolId: string,
    resourceId: string,
    teacherId: string,
    courseId: string
) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/school/get-resource-result?schoolId=${schoolId}&resourceId=${resourceId}&teacherId=${teacherId}&courseId=${courseId}`,
        {
            method: 'GET',
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getSchoolResourceResults'],
            },
        }
    );
    const response = await result.json();
    return response;
};
