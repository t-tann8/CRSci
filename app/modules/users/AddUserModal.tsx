'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm, FormProvider } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { Label } from '@/app/components/ui/label';
import AppDropDown, {
    OptionsInterface,
} from '@/app/components/common/AppDropDown';
import { ModalHeader } from '@/app/components/common/ModalHeader';
import { useAppDispatch, useAppSelector } from '@/lib/react-redux/hooks';
import {
    signupInvite,
    signupInvitePayload,
} from '@/lib/react-redux/features/auth/authAction';
import { Button } from '@/app/components/ui/button';
import Input from '@/app/components/common/Input';
import { validationError } from '@/lib/utils';
import Loader from '@/app/components/common/ButtonLoader';

function ProfileModal({ onClose, school, setSchool, schoolList }: any) {
    const [role, setRole] = useState('student');
    const dispatch = useAppDispatch();
    const state = useAppSelector((state: { user: any }) => state.user);
    const { data } = useSession();
    const allRoles: OptionsInterface[] = [
        { label: 'student', value: 'Student' },
        { label: 'teacher', value: 'Teacher' },
        { label: 'school', value: 'School' },
        { label: 'admin', value: 'Admin' },
    ];
    const methods = useForm({ mode: 'onChange', reValidateMode: 'onChange' });

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(event.target.value);
    };
    const handleSchoolChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSchool(event.target.value);
    };

    const onFormSubmit = async (formData: any) => {
        const { username, email } = formData;
        const getSchoolId = schoolList.find(
            (value: { value: string; id: string }) => value?.value === school
        );
        const accessToken = data?.user.accessToken || '';

        const payload: signupInvitePayload = {
            email,
            username,
            role,
            accessToken,
        };

        if (role === 'teacher' || role === 'student') {
            payload.schoolId = getSchoolId?.id;
        }

        const response = await dispatch(signupInvite(payload));
        if (response.type === 'user/signupInvite/rejected') {
            return toast.error(response.payload);
        }
        return toast.success('Invitation sent successfully');
    };

    return (
        <FormProvider {...methods}>
            <section className="w-full bg-white h-screen py-4 shadow-lg">
                <div className="h-[80%] lg:h-[95%] overflow-y-auto px-6">
                    <ModalHeader
                        headerText={{
                            heading: 'Add New User',
                            tagline: 'Invite user to CRS',
                        }}
                        onClose={onClose}
                    />

                    <form onSubmit={methods.handleSubmit(onFormSubmit)}>
                        <div className="mt-2">
                            <Label htmlFor="username">User Name</Label>
                            <Input
                                name="username"
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
                        <div className="flex flex-col space-y-2 mt-3">
                            <Label htmlFor="role ">Role</Label>
                            <AppDropDown
                                name="role"
                                options={allRoles}
                                value={role}
                                onChange={handleRoleChange}
                            />
                        </div>
                        {(role === 'student' || role === 'teacher') && (
                            <div className="flex flex-col space-y-2 mt-3">
                                <Label htmlFor="school">School</Label>
                                <AppDropDown
                                    name="school"
                                    options={schoolList}
                                    value={school}
                                    onChange={handleSchoolChange}
                                />
                            </div>
                        )}

                        <div className="text-center mt-8">
                            <Button
                                type="submit"
                                className="w-full bg-primary-color lg:hover:bg-orange-400 mb-3"
                            >
                                {state.loading ? <Loader /> : 'Invite'}
                            </Button>
                        </div>
                    </form>
                </div>
            </section>
        </FormProvider>
    );
}

export default ProfileModal;
