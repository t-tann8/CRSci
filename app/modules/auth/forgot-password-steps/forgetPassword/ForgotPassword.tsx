'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import loginimage2 from '@/app/assets/images/leftside2.svg';
import loginimage3 from '@/app/assets/images/leftside3.svg';
import loginimage4 from '@/app/assets/images/leftside4.svg';
import signupImage from '@/app/assets/images/signup1.svg';
import { Button } from '@/app/components/ui/button';
import AppInput from '@/app/components/common/AppInput';
import crscLogo from '@/app/assets/images/crsclogo.svg';
import { Label } from '@/app/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/lib/react-redux/hooks';
import { forgotPassword } from '@/lib/react-redux/features/auth/authAction';
import { toast } from 'react-toastify';
import Loader from '@/app/components/common/ButtonLoader';
import LeftSide from '../../common/LeftSide';

function ForgotPassword({ handleNextStep }: { handleNextStep: () => void }) {
    const { push } = useRouter();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const { loading, data } = useAppSelector((state) => state.user);
    const images = [signupImage, loginimage2, loginimage3, loginimage4];
    const metaText = {
        title: 'Reset Password!',
        description: 'Forgot Your Password Don’t worry lets Recover It',
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const response = await dispatch(forgotPassword({ email }));
        if (response.type === 'user/forgotPassword/rejected') {
            return toast.error(response.payload);
        }
        toast.success('OTP sent successfully');
        return handleNextStep();
    };

    return (
        <section className="flex lg:flex-row flex-col justify-between  h-screen">
            <div className="w-full hidden lg:block">
                <LeftSide images={images} metaText={metaText} />
            </div>
            <div className="w-full  flex flex-col justify-center items-center ">
                <div className=" p-8 md:p-10 w-[100%] lg:w-[75%] flex flex-col ">
                    <div className="flex  lg:items-start flex-col">
                        <Image
                            height={100}
                            width={100}
                            src={crscLogo}
                            alt="CRSC Logo"
                        />
                        <h1 className="text-2xl font-semibold mt-6">
                            Forgot Password
                        </h1>
                        <p className="text-sm font-medium text-dark-gray mb-6">
                            Enter Email to Send Verification Code
                        </p>
                    </div>
                    <form>
                        <div className="mt-2">
                            <Label htmlFor="email">Email Address</Label>

                            <AppInput
                                type="email"
                                id="email"
                                placeholder="Enter Email"
                                onChange={handleEmailChange}
                            />
                        </div>

                        <div className="text-center mt-8">
                            <Button
                                type="button"
                                disabled={loading}
                                className="w-full bg-primary-color lg:hover:bg-orange-400 mb-3"
                                onClick={handleSubmit}
                            >
                                {loading ? <Loader /> : 'Get Verification Code'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default ForgotPassword;
