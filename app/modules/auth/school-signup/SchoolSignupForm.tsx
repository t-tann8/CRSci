'use client';

import React from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import crscLogo from '@/app/assets/images/crsclogo.svg';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import Input from '@/app/components/common/Input';
import { validationError } from '@/lib/utils';
import ButtonLoader from '@/app/components/common/ButtonLoader';
import { createSchoolAPI } from '@/app/api/school';
import { Eye, EyeOff } from 'lucide-react';

function SchoolSignupForm({ token }: { token: string }) {
    const [isLoader, setIsLoader] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const { push } = useRouter();

    const methods = useForm({ mode: 'onChange', reValidateMode: 'onChange' });

    // eslint-disable-next-line consistent-return
    const onFormSubmit = async (data: any) => {
        try {
            setIsLoader(true);
            const { name, email, password, schoolName } = data;
            const result = await createSchoolAPI(
                token,
                name,
                email,
                schoolName,
                password
            );
            if (result.status === 'error') {
                return toast.error(result.message);
            }
            toast.success(result.message);
            return push('/signin');
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoader(false);
        }
    };
    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <FormProvider {...methods}>
            <div className=" px-8 py-2 md:px-10 md:py-2 w-[100%] lg:w-[75%] flex flex-col ">
                <div className="flex lg:items-start flex-col">
                    <Image
                        height={100}
                        width={100}
                        src={crscLogo}
                        alt="CRSC Logo"
                    />
                    <h1 className="text-2xl font-semibold mt-6">
                        Create School{' '}
                    </h1>
                    <p className="text-sm font-medium text-dark-gray mb-6">
                        Enter Details to Create your Account
                    </p>
                </div>
                <form onSubmit={methods.handleSubmit(onFormSubmit)}>
                    <div className="mt-2">
                        <Label htmlFor="name">User Name</Label>
                        <Input
                            name="name"
                            placeholder="Enter Name"
                            type="text"
                            rules={{
                                required: {
                                    value: true,
                                    message: validationError.REQUIRED_FIELD,
                                },
                            }}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            name="email"
                            placeholder="Enter Email"
                            type="email"
                            rules={{
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: validationError.VALID_EMAIL,
                                },
                                required: {
                                    value: true,
                                    message: validationError.REQUIRED_FIELD,
                                },
                            }}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="email">School Name</Label>
                        <Input
                            name="schoolName"
                            placeholder="Enter School Name"
                            type="text"
                            rules={{
                                required: {
                                    value: true,
                                    message: validationError.REQUIRED_FIELD,
                                },
                            }}
                        />
                    </div>

                    <div className="mt-2 relative">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            name="password"
                            placeholder="Enter Password"
                            type="password"
                            rules={{
                                required: {
                                    value: true,
                                    message: validationError.REQUIRED_FIELD,
                                },
                                pattern: {
                                    value:
                                        // eslint-disable-next-line no-useless-escape
                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-\+=:;"'?\/>.<,{}\[\]])[a-zA-Z\d~`!@#$%^&*()_\-\+=:;"'?\/>.<,{}\[\]]{8,}$/,
                                    message:
                                        validationError.PASSWORD_VALIDATION_INFO_TEXT,
                                },
                                minLength: {
                                    value: 8,
                                    message: validationError.MIN_LENGTH,
                                },
                                maxLength: {
                                    value: 20,
                                    message: validationError.MAX_LENGTH,
                                },
                            }}
                        />
                        <button
                            type="button"
                            onClick={toggleShowPassword}
                            className="absolute right-3 top-10 mt-1"
                        >
                            {showPassword ? (
                                <Eye className="w-5 h-5" />
                            ) : (
                                <EyeOff className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <div className="text-center mt-5">
                        <Button
                            type="submit"
                            disabled={isLoader}
                            className="w-full bg-primary-color lg:hover:bg-orange-400 mb-3"
                        >
                            {isLoader ? <ButtonLoader /> : 'Sign Up'}
                        </Button>
                        {/* <span className="text-black text-xs">Or</span>
                        <Button className="w-full bg-slate-200 text-black mt-3 lg:hover:bg-slate-300">
                            <GoogleIcon
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                            Sign Up With Google
                        </Button> */}
                    </div>
                </form>
            </div>
        </FormProvider>
    );
}

export default SchoolSignupForm;
