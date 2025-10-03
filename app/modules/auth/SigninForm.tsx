'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getSession, signIn } from 'next-auth/react';
import { useForm, FormProvider } from 'react-hook-form';
import crscLogo from '@/app/assets/images/crsclogo.svg';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import GoogleIcon from '@/app/assets/icons/GoogleIcon';
import Input from '@/app/components/common/Input';
import Loader from '@/app/components/common/ButtonLoader';
import { validationError } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

function SigninForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const defaultValues = {
        email: '',
        password: '',
        remember: false,
    };

    if (typeof window !== 'undefined') {
        defaultValues.email = localStorage.getItem('myapp-email') || '';
        defaultValues.password = localStorage.getItem('myapp-password') || '';
        defaultValues.remember = !!localStorage.getItem('myapp-email');
    }

    const methods = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues,
    });

    const { register, handleSubmit, watch, setValue } = methods;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setValue('email', localStorage.getItem('myapp-email') || '');
            setValue('password', localStorage.getItem('myapp-password') || '');
            setValue('remember', !!localStorage.getItem('myapp-email'));
        }
    }, [setValue]);

    const remember = () => {
        if (watch('remember')) {
            localStorage.setItem('myapp-email', watch('email'));
            localStorage.setItem('myapp-password', watch('password'));
        } else {
            localStorage.removeItem('myapp-email');
            localStorage.removeItem('myapp-password');
        }
    };

    // eslint-disable-next-line consistent-return
    const onFormSubmit = async (data: any) => {
        try {
            setLoading(true);
            remember();
            const { email, password } = data;
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
            const session = await getSession();
            if (session) {
                const role = session?.user?.role;
                if (role) {
                    toast.success('Login Successful');
                    return router.push(`/${role}`);
                }
                return toast.error(session?.user?.message);
            }
        } catch (error) {
            return error;
        } finally {
            setLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <FormProvider {...methods}>
            <div className="p-8 md:p-10 w-[100%] lg:w-[75%] flex flex-col">
                <div className="flex lg:items-start flex-col">
                    <Image
                        height={100}
                        width={100}
                        src={crscLogo}
                        alt="CRSC Logo"
                    />
                    <h1 className="text-2xl font-semibold mt-6">Sign In</h1>
                    <p className="text-sm font-medium text-dark-gray mb-6">
                        Enter Your Email & Password
                    </p>
                </div>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="mt-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            name="email"
                            placeholder="Enter Email"
                            type="email"
                            rules={{
                                required: {
                                    value: true,
                                    message: validationError.REQUIRED_FIELD,
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: validationError.VALID_EMAIL,
                                },
                            }}
                        />
                    </div>
                    <div className="mt-2 relative">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            name="password"
                            placeholder="Enter Password"
                            type={showPassword ? 'text' : 'password'}
                            rules={{
                                required: {
                                    value: true,
                                    message: validationError.REQUIRED_FIELD,
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
                    <div className="flex mb-12 mt-5">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                {...register('remember')}
                                defaultChecked={defaultValues.remember}
                            />
                            <label
                                htmlFor="remember"
                                className="text-xs text-black ml-2"
                            >
                                Remember Me
                            </label>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-xs text-black ml-auto lg:hover:text-sky-400"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="text-center">
                        <Button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-primary-color lg:hover:bg-orange-400 mb-3"
                        >
                            {loading ? <Loader /> : 'Sign In'}
                        </Button>
                        {/* <span className="text-black text-xs">Or</span>
                        <Button
                            onClick={() => signIn('google')}
                            className="w-full bg-slate-200 text-black mt-3 lg:hover:bg-slate-300"
                        >
                            <GoogleIcon
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                            Sign In With Google
                        </Button> */}
                    </div>
                </form>
            </div>
        </FormProvider>
    );
}

export default SigninForm;
