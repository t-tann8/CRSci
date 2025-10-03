'use client';

import React, { useState } from 'react';
import ForgotPassword from '@/app/modules/auth/forgot-password-steps/forgetPassword/ForgotPassword';
import VerifyOTP from '@/app/modules/auth/forgot-password-steps/forgetPassword/verify-otp/VerifyOTP';
import NewPassword from '@/app/modules/auth/forgot-password-steps/forgetPassword/verify-otp/new-password/NewPassword';

function Steps() {
    const [step, setStep] = useState(0);

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    return (
        <>
            {step === 0 && <ForgotPassword handleNextStep={handleNextStep} />}
            {step === 1 && (
                <VerifyOTP
                    handleNextStep={handleNextStep}
                    handlePreviousStep={handlePreviousStep}
                />
            )}
            {step === 2 && <NewPassword />}
        </>
    );
}

export default Steps;
