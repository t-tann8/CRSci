import axios from 'axios';

export const getUserProfileAPI = async (accessToken: string) => {
    const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/getUserProfile`,
        {
            headers: {
                accesstoken: accessToken,
            },
        }
    );

    return result;
};

export const updateUserProfileAPI = async (
    accessToken: string,
    image: string,
    name: string,
    email: string,
    password: string,
    schoolName?: string
) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/updateUserProfile`,
        {
            accessToken,
            image,
            name,
            email,
            password,
            ...(schoolName && { schoolName }),
        }
    );

    return result;
};

export const getAllUsersProfileAPI = async (
    accessToken: string,
    page: number = 1,
    limit: number = 10,
    orderBy: string = '',
    sortBy: string = '',
    keyword: string = '',
    role: string = ''
) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/getAllUsersProfile?limit=${limit}&page=${page}&orderBy=${orderBy}&sortBy=${sortBy}&keyword=${keyword}&role=${role}`,
        {
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getAllUsers'],
            },
        }
    );

    return result;
};

export const updateAnotherUserProfileAPI = async (
    accessToken: string,
    image: string,
    name: string,
    email: string,
    userId: string,
    role: string
) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/updateAnotherUsersProfile`,
        {
            accessToken,
            image,
            name,
            email,
            userId,
            role,
        }
    );

    return result;
};

export const deleteUserProfileAPI = async (
    accessToken: string,
    userId: string
) => {
    const result = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/deleteAnotherUsersProfile`,
        {
            headers: {
                accessToken,
                userId,
            },
        }
    );

    return result;
};

export const getAllTeacherAPI = async (accessToken: string) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/getAllTeachers`,
        {
            headers: {
                accesstoken: accessToken,
            },
            next: {
                tags: ['getAllTeachers'],
            },
        }
    );
    const response = await result.json();
    return response;
};
