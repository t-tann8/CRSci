'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import AppInput from '@/app/components/common/AppInput';
import GoogleIcon from '@/app/assets/icons/GoogleIcon';
import { CheckBox } from '../../Checkbox';
import Steps from '../Steps';

function SchoolProfile() {
    const { push } = useRouter();
    const pathName = usePathname();
    return (
        <div className=" p-8 md:p-10 w-[100%] lg:w-[75%] flex flex-col ">
            <Steps step={2} totalSteps={3} />

            <div className="flex lg:items-start flex-col">
                <h1 className="text-2xl font-semibold mt-6">
                    Create School Profile
                </h1>
                <p className="text-sm font-medium text-dark-gray mb-6">
                    Enter Your School Details
                </p>
            </div>
            <form>
                <div className="mt-3">
                    <Label htmlFor="school_name">School Name</Label>
                    <AppInput
                        placeholder="Enter School Name"
                        id="school_name"
                    />
                </div>

                <div className="mt-3">
                    <Label htmlFor="no_of_teachers">
                        No of Teacher&rsquo;s
                    </Label>
                    <AppInput placeholder="e.g: 30" id="no_of_teachers" />
                </div>

                <div className="mt-3">
                    <Label htmlFor="no_of_students">Student Population</Label>
                    <AppInput placeholder="e.g: 200" id="no_of_students" />
                </div>

                <div className="mt-3">
                    <Label htmlFor="courses">
                        Courses{' '}
                        <span className="text-sm text-gray-500">
                            (Seprated by &ldquo;,&ldquo;)
                        </span>
                    </Label>
                    <AppInput placeholder="Type Courses" id="courses" />
                </div>

                <div className="text-center mt-10">
                    <Button
                        type="button"
                        className="w-full bg-primary-color lg:hover:bg-orange-400 mb-3"
                        onClick={() => push(`${pathName}/invite-teacher`)}
                    >
                        Next
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default SchoolProfile;
