import React from 'react';
import CreatePasswordForm from '@/app/components/common/auth/CreatePasswordForm';
import LeftSide from '../common/LeftSide';

function CreatePassword({ images, metaText }: any) {
    return (
        <section className="flex lg:flex-row flex-col justify-between  h-screen">
            <div className="w-full hidden lg:block">
                <LeftSide images={images} metaText={metaText} />
            </div>
            <div className="w-full  flex flex-col justify-center items-center ">
                <CreatePasswordForm description="It’s Your First Time Let’s Create Password" />
            </div>
        </section>
    );
}

export default CreatePassword;
