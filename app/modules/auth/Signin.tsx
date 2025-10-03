import React from 'react';
import loginimage1 from '@/app/assets/images/leftside1.svg';
import loginimage2 from '@/app/assets/images/leftside2.svg';
import loginimage3 from '@/app/assets/images/leftside3.svg';
import loginimage4 from '@/app/assets/images/leftside4.svg';
import LeftSide from './common/LeftSide';
import SigninForm from './SigninForm';

function Signin() {
    const images = [loginimage1, loginimage2, loginimage3, loginimage4];
    const metaText = {
        title: 'Welcome Back!',
        description: 'Enter your Credentials to Access Your Account.',
    };
    return (
        <section className="flex lg:flex-row flex-col justify-between  h-screen">
            <div className="w-full hidden lg:block">
                <LeftSide images={images} metaText={metaText} />
            </div>
            <div className="w-full  flex flex-col justify-center items-center ">
                <SigninForm />
            </div>
        </section>
    );
}

export default Signin;
