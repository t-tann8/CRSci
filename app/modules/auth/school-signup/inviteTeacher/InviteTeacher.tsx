'use client';

import React from 'react';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import AppInput from '@/app/components/common/AppInput';
import GoogleIcon from '@/app/assets/icons/GoogleIcon';
import { CheckBox } from '../../Checkbox';
import Steps from '../Steps';
import TeacherCard, { TeacherCardInterface } from './TeacherCard';

function InviteTeacher() {
    const data: TeacherCardInterface[] = [
        {
            id: '1',
            email: 'abc@gmail.com',
            name: 'Ali',
        },
        {
            id: '2',
            email: 'abc@gmail.com',
            name: 'Ali',
        },
        {
            id: '3',
            email: 'abc@gmail.com',
            name: 'Ali',
        },
        {
            id: '4',
            email: 'abc@gmail.com',
            name: 'Ali',
        },
        {
            id: '5',
            email: 'abc@gmail.com',
            name: 'Ali',
        },
    ];
    return (
        <div className=" p-8 md:p-10 w-[100%] lg:w-[75%] flex flex-col ">
            <Steps step={3} totalSteps={3} />

            <div className="flex lg:items-start flex-col">
                <h1 className="text-2xl font-semibold mt-6">Invite Teachers</h1>
                <p className="text-sm font-medium text-dark-gray mb-6">
                    Enter Teacher Details
                </p>
            </div>
            <form>
                <div className="mt-3">
                    <Label htmlFor="teacher_name">Teacher Name</Label>
                    <AppInput
                        placeholder="Enter Teacher Name"
                        id="teacher_name"
                    />
                </div>

                <div className="mt-3">
                    <Label htmlFor="email">Teacher Email</Label>
                    <AppInput
                        placeholder="Email here"
                        id="email"
                        type="email"
                    />
                </div>

                <div className="text-center my-5">
                    <Button
                        type="button"
                        className="w-full border bg-transparent text-dark-gray lg:hover:bg-gray-400 lg:hover:text-white mb-3"
                    >
                        Add
                    </Button>
                </div>

                <div className="grid lg:grid-cols-2 gap-3">
                    {data.map((record) => (
                        <div key={record.id}>
                            <TeacherCard
                                name={record.name}
                                email={record.email}
                                id={record.id}
                            />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-6">
                    <Button
                        type="button"
                        className="w-full bg-primary-color lg:hover:bg-orange-400 mb-3"
                    >
                        Next
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default InviteTeacher;
