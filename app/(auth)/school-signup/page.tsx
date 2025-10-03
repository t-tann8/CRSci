import React from 'react';
import loginimage2 from '@/app/assets/images/leftside2.svg';
import loginimage3 from '@/app/assets/images/leftside3.svg';
import loginimage4 from '@/app/assets/images/leftside4.svg';
import signupImage from '@/app/assets/images/signup1.svg';
import LeftSide from '@/app/modules/auth/common/LeftSide';
import SchoolSignupForm from '@/app/modules/auth/school-signup/SchoolSignupForm';
import PageNotFound from '@/app/modules/error/PageNotFound';

function SchoolSignupPage({
    searchParams,
}: {
    searchParams: { token: string };
}) {
    const images = [signupImage, loginimage2, loginimage3, loginimage4];
    const metaText = {
        title: 'Welcome To CRS!',
        description:
            'Admin invited you to Create School, Enter details to Create your Account!',
    };
    if (!searchParams.token) {
        return <PageNotFound />;
    }
    return (
        <section className="flex lg:flex-row flex-col justify-between  h-screen">
            <div className="w-full hidden lg:block">
                <LeftSide images={images} metaText={metaText} />
            </div>
            <div className="w-full  flex flex-col justify-center items-center ">
                <SchoolSignupForm token={searchParams?.token} />
            </div>
        </section>
    );
}

export default SchoolSignupPage;
