import React from 'react';
import Signin from '@/app/modules/auth/Signin';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Log in securely to your CRS account.',
};

function SigninPage() {
    return <Signin />;
}

export default SigninPage;
