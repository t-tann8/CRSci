'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import loginimage2 from '@/app/assets/images/leftside2.svg';
import loginimage3 from '@/app/assets/images/leftside3.svg';
import loginimage4 from '@/app/assets/images/leftside4.svg';
import signupImage from '@/app/assets/images/signup1.svg';
import { Button } from '@/app/components/ui/button';
import crscLogo from '@/app/assets/images/crsclogo.svg';
import { Label } from '@/app/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/lib/react-redux/hooks';
import { verifyOTP } from '@/lib/react-redux/features/auth/authAction';
import { toast } from 'react-toastify';
import ButtonLoader from '@/app/components/common/ButtonLoader';
import LeftSide from '../../../common/LeftSide';
import { OTPInput } from './OTPInput';

function VerifyOTP({
    handleNextStep,
    handlePreviousStep,
}: {
    handleNextStep: () => void;
    handlePreviousStep: () => void;
}) {
    const images = [signupImage, loginimage2, loginimage3, loginimage4];
    const [otpArray, setOtpArray] = useState(['', '', '', '']);
    const [isLoader, setIsLoader] = useState(false);
    const { push } = useRouter();
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.user);
    // const [isPageLoading, setIsPageLoading] = useState(false);
    const metaText = {
        title: 'Reset Password!',
        description: 'Forgot Your Password Don’t worry lets Recover It',
    };

    const handleOtpChange = (index: number, value: string) => {
        const updatedOtpArray = [...otpArray];
        updatedOtpArray[index] = value;
        setOtpArray(updatedOtpArray);
    };

    const handleBackspace = (currentIndex: number) => {
        const updatedOtpArray = [...otpArray];
        updatedOtpArray[currentIndex] = '';
        setOtpArray(updatedOtpArray);
        if (currentIndex >= 0) {
            const prevInput = document.getElementById(
                `otpInput_${currentIndex - 1}`
            );
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    const handleFocusNext = (currentIndex: number) => {
        if (currentIndex < 3) {
            const nextInput = document.getElementById(
                `otpInput_${currentIndex + 1}`
            );
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handlePaste = (pastedOTP: string) => {
        if (pastedOTP) {
            const sanitizedArray = pastedOTP.replace(/\D/g, '');
            const otpSepratedArray = sanitizedArray.split('');
            setOtpArray(otpSepratedArray);
            const lastInput = document.getElementById('otpInput_3');
            if (lastInput) {
                lastInput.focus();
            }
        }
    };

    // eslint-disable-next-line consistent-return
    const handleSubmit = async () => {
        try {
            setIsLoader(true);
            const OTP = otpArray.join('');
            const { id } = state.data;
            const response = await dispatch(verifyOTP({ id, OTP }));
            if (response.type === 'user/verifyOTP/rejected') {
                toast.error(response.payload);
                return handlePreviousStep();
            }
            toast.success('Successfully Verified');
            return handleNextStep();
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoader(false);
        }
    };

    return (
        <section className="flex lg:flex-row flex-col justify-between  h-screen">
            <div className="w-full hidden lg:block">
                <LeftSide images={images} metaText={metaText} />
            </div>
            <div className="w-full  flex flex-col justify-center items-center ">
                <div className=" p-8 md:p-10 w-[100%] lg:w-[65%] flex flex-col ">
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
                        <p className="text-sm font-medium text-dark-gray">
                            Please enter the code sent to your email for
                            verification.
                        </p>
                        <div className="text-sm font-medium text-dark-gray my-6">
                            <p>We Have Send Verification Code On</p>
                            <p className="text-primary-color">
                                {state.data.email}
                            </p>
                        </div>
                    </div>
                    <form>
                        <div className="mt-2">
                            <Label htmlFor="email">Verification Code</Label>

                            <div className="grid grid-cols-4 gap-4">
                                {[0, 1, 2, 3].map((index) => (
                                    <OTPInput
                                        index={index}
                                        key={index}
                                        value={otpArray[index]}
                                        onChange={(value) =>
                                            handleOtpChange(index, value)
                                        }
                                        onBackspace={() =>
                                            handleBackspace(index)
                                        }
                                        onFocusNext={() =>
                                            handleFocusNext(index)
                                        }
                                        onPaste={handlePaste}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="text-center mt-10">
                            <Button
                                type="button"
                                disabled={isLoader}
                                className="w-full bg-primary-color lg:hover:bg-orange-400 mb-3"
                                onClick={handleSubmit}
                            >
                                {isLoader ? <ButtonLoader /> : 'Verify Now'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default VerifyOTP;
