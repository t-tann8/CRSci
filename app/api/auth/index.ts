import axios from 'axios';

axios.defaults.withCredentials = true;

export const loginAPI = async (email: string, password: string) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
            email,
            password,
        }
    );

    return result;
};

export const forgotPasswordAPI = async (email: string) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/forgot-password`,
        {
            email,
        }
    );

    return result;
};

export const verifyOTPAPI = async (userId: string, OTP: string) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-otp`,
        {
            userId,
            OTP,
        }
    );

    return result;
};

export const resetPasswordAPI = async (userId: string, newPassword: string) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
        {
            userId,
            newPassword,
        }
    );

    return result;
};

export const signupInviteAPI = async (
    name: string,
    email: string,
    role: string,
    accessToken: string,
    schoolId?: string
) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/emailBasedInvite`,
        {
            name,
            email,
            role,
            accessToken,
            schoolId,
        }
    );

    return result;
};

export const signupAPI = async (
    name: string,
    email: string,
    password: string,
    token: string
) => {
    const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/emailBasedSignup/token/${token}`,
        {
            name,
            email,
            password,
        }
    );

    return result;
};
