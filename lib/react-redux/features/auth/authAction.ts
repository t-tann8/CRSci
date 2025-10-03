import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    loginAPI,
    forgotPasswordAPI,
    verifyOTPAPI,
    resetPasswordAPI,
    signupInviteAPI,
    signupAPI,
} from '@/app/api/auth';

interface LoginPayload {
    email: string;
    password: string;
}

export const login = createAsyncThunk(
    'user/login',
    async ({ email, password }: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await loginAPI(email, password);
            const emailResponse = response.data;
            return emailResponse.data;
        } catch (error: Error | any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    }
);

interface ForgotPasswordPayload {
    email: string;
}

export const forgotPassword = createAsyncThunk(
    'user/forgotPassword',
    async ({ email }: ForgotPasswordPayload, { rejectWithValue }) => {
        try {
            const response = await forgotPasswordAPI(email);
            const emailResponse = response.data;
            return emailResponse.data;
        } catch (error: Error | any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    }
);

interface VerifyOTPPayload {
    id: string;
    OTP: string;
}

export const verifyOTP = createAsyncThunk(
    'user/verifyOTP',
    async ({ id, OTP }: VerifyOTPPayload, { rejectWithValue }) => {
        try {
            const response = await verifyOTPAPI(id, OTP);
            const emailResponse = response.data;
            return emailResponse.data;
        } catch (error: Error | any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    }
);

interface resetPasswordPayload {
    id: string;
    newPassword: string;
}

export const resetPassword = createAsyncThunk(
    'user/resetPassword',
    async ({ id, newPassword }: resetPasswordPayload, { rejectWithValue }) => {
        try {
            const response = await resetPasswordAPI(id, newPassword);
            const emailResponse = response.data;
            return emailResponse.data;
        } catch (error: Error | any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    }
);

export interface signupInvitePayload {
    username: string;
    email: string;
    role: string;
    accessToken: string;
    schoolId?: string;
}

export const signupInvite = createAsyncThunk(
    'user/signupInvite',
    async (
        { username, email, role, accessToken, schoolId }: signupInvitePayload,
        { rejectWithValue }
    ) => {
        try {
            const response = await signupInviteAPI(
                username,
                email,
                role,
                accessToken,
                schoolId
            );
            const emailResponse = response.data;
            return emailResponse.data;
        } catch (error: Error | any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    }
);

interface signupPayload {
    name: string;
    email: string;
    password: string;
    token: string;
}

export const signup = createAsyncThunk(
    'user/signup',
    async (
        { name, email, password, token }: signupPayload,
        { rejectWithValue }
    ) => {
        try {
            const response = await signupAPI(name, email, password, token);
            const emailResponse = response.data;
            return emailResponse.data;
        } catch (error: Error | any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    }
);
