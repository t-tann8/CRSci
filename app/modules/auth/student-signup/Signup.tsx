import React from 'react';
import loginimage1 from '@/app/assets/images/leftside1.svg';
import loginimage2 from '@/app/assets/images/leftside2.svg';
import loginimage3 from '@/app/assets/images/leftside3.svg';
import loginimage4 from '@/app/assets/images/leftside4.svg';
import signupImage from '@/app/assets/images/signup1.svg';
import LeftSide from '../common/LeftSide';
import SignupForm from './SignupForm';

function Signin({ token }: { token: string }) {
    const images = [signupImage, loginimage2, loginimage3, loginimage4];
    const metaText = {
        title: 'Welcome To CRS!',
        description:
            'Your Teacher invited you to Class, Enter details to Create your Account!',
    };
    return (
        <section className="flex lg:flex-row flex-col justify-between  h-screen">
            <div className="w-full hidden lg:block">
                <LeftSide images={images} metaText={metaText} />
            </div>
            <div className="w-full  flex flex-col justify-center items-center ">
                <SignupForm token={token} />
            </div>
        </section>
    );
}

export default Signin;
