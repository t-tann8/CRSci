// eslint-disable-next-line import/no-extraneous-dependencies
import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            /** The user's postal address. */
            accessToken: string;
            email: string;
            id: stirng;
            name: string;
            role: string;
            message: string; // error message
            schoolId?: string;
        };
    }
}
