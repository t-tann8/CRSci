import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
    signupInvite,
    signup,
} from './authAction';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

type state = {
    loading: boolean;
    data: User;
    error: string;
};

const initialState: state = {
    loading: false,
    data: {
        id: '',
        name: '',
        email: '',
        role: '',
    },
    error: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // login action
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(
            login.fulfilled,
            (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.data.id = action.payload.id;
                state.data.name = action.payload.name;
                state.data.email = action.payload.email;
                state.data.role = action.payload.role;
                state.error = '';
            }
        );
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.data = initialState.data;
            state.error = action.error.message || 'Something went wrong';
        });
        // forgot password action
        builder.addCase(forgotPassword.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(
            forgotPassword.fulfilled,
            (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.data.id = action.payload.id;
                state.data.email = action.payload.email;
                state.error = '';
            }
        );
        builder.addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.data = initialState.data;
            state.error = action.error.message || 'Something went wrong';
        });
        // verify OTP action
        builder.addCase(verifyOTP.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(
            verifyOTP.fulfilled,
            (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.error = '';
            }
        );
        builder.addCase(verifyOTP.rejected, (state, action) => {
            state.loading = false;
            state.data = initialState.data;
            state.error = action.error.message || 'Something went wrong';
        });
        // Reset Password action
        builder.addCase(resetPassword.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(
            resetPassword.fulfilled,
            (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.error = '';
            }
        );
        builder.addCase(resetPassword.rejected, (state, action) => {
            state.loading = false;
            state.data = initialState.data;
            state.error = action.error.message || 'Something went wrong';
        });
        // signup Invite action
        builder.addCase(signupInvite.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(signupInvite.fulfilled, (state) => {
            state.loading = false;
            state.error = '';
        });
        builder.addCase(signupInvite.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Something went wrong';
        });
        // signup action
        builder.addCase(signup.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(signup.fulfilled, (state) => {
            state.loading = false;
            state.error = '';
        });
        builder.addCase(signup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Something went wrong';
        });
    },
});

export default userSlice.reducer;
