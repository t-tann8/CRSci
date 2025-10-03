import React from 'react';
import PageNotFound from '@/app/modules/error/PageNotFound';
import Signup from '@/app/modules/auth/student-signup/Signup';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign up',
    description: 'Sign up securely to your CRS account.',
};
function SignupPage({ searchParams }: { searchParams: { token: string } }) {
    if (!searchParams.token) {
        return <PageNotFound />;
    }
    return <Signup token={searchParams.token} />;
}

export default SignupPage;
