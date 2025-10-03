'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import GoogleIcon from '@/app/assets/icons/GoogleIcon';
import AppInput from '@/app/components/common/AppInput';
import { CheckBox } from '../Checkbox';
import Steps from './Steps';

function SchoolSignup1() {
    const { push } = useRouter();
    const pathName = usePathname();
    return (
        <div className=" p-8 md:p-10 w-[100%] lg:w-[75%] flex flex-col">
            <Steps step={1} totalSteps={3} />

            <div className="flex lg:items-start flex-col">
                <h1 className="text-2xl font-semibold mt-6">Create Account</h1>
                <p className="text-sm font-medium text-dark-gray mb-6">
                    Enter Details to Create your Account
                </p>
            </div>
            <form>
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <AppInput
                        type="email"
                        id="email"
                        placeholder="Enter Email"
                    />
                </div>

                <div className="mt-2">
                    <Label htmlFor="name ">User Name</Label>
                    <AppInput type="name" id="name" placeholder="Enter Name" />
                </div>

                <div className="mt-2">
                    <Label htmlFor="password ">Password</Label>
                    <AppInput
                        type="password"
                        id="password"
                        placeholder="Enter Password"
                    />
                </div>

                <div className="text-center">
                    <Button
                        type="button"
                        className="w-full bg-primary-color lg:hover:bg-orange-400 mb-3"
                        onClick={() => push(`${pathName}/school-profile`)}
                    >
                        Sign Up
                    </Button>
                    <span className="text-black text-xs">Or</span>
                    <Button className="w-full bg-slate-200 text-black mt-3 lg:hover:bg-slate-300">
                        <GoogleIcon width={20} height={20} className="mr-2" />
                        Sign Up With Google
                    </Button>
                </div>
                <div className="flex space-x-2 mt-4 justify-center">
                    <p>Already have an Account?</p>
                    <Link href="/signin">
                        <p className="underline text-primary-color font-semibold">
                            Signin
                        </p>
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default SchoolSignup1;
