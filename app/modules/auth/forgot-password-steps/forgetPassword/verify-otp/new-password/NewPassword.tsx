'use client';

import React from 'react';
import Image from 'next/image';
import loginimage2 from '@/app/assets/images/leftside2.svg';
import loginimage3 from '@/app/assets/images/leftside3.svg';
import loginimage4 from '@/app/assets/images/leftside4.svg';
import signupImage from '@/app/assets/images/signup1.svg';
import CreatePasswordForm from '@/app/components/common/auth/CreatePasswordForm';
import LeftSide from '../../../../common/LeftSide';

function ForgotPassword() {
    const images = [signupImage, loginimage2, loginimage3, loginimage4];
    const metaText = {
        title: 'Reset Password!',
        description: 'Forgot Your Password Don’t worry lets Recover It',
    };
    return (
        <section className="flex lg:flex-row flex-col justify-between  h-screen">
            <div className="w-full hidden lg:block">
                <LeftSide images={images} metaText={metaText} />
            </div>
            <div className="w-full  flex flex-col justify-center items-center ">
                <CreatePasswordForm description="Let’s Create New Password" />
            </div>
        </section>
    );
}

export default ForgotPassword;
