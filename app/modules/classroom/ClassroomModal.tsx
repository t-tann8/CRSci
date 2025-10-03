'use client';

import Image from 'next/image';
import { Session } from 'next-auth';
import { toast } from 'react-toastify';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FileLineChart, Trash2, X } from 'lucide-react';
import {
    getAllClassroomsOfTeacherAPI,
    updateClassroomStudentAPI,
} from '@/app/api/classroom';
import action from '@/app/action';
import { Label } from '@/app/components/ui/label';
import Input from '@/app/components/common/Input';
import Select from '@/app/components/common/DropDown';
import PageLoader from '@/app/components/common/PageLoader';
import { DEFAULT_IMAGE, validationError } from '@/lib/utils';
import ButtonLoader from '@/app/components/common/ButtonLoader';
import useProfileImage from '@/lib/custom-hooks/useProfileImage';
import { OptionsInterface } from '@/app/components/common/AppDropDown';

export interface StudentInfoInterface {
    id: string;
    index?: number;
    name: string;
    email: string;
    image: string;
    classroomStudentId?: string;
    totalFinishedResources?: number;
    totalResourcesCount?: number;
    performance?: number;
    grade: string;
    gradeId: string;
}
interface FormValues {
    name: string;
    email: string;
    classroom: string;
}

function ClassroomModal({
    data,
    student,
    onClose,
}: {
    data: Session | null;
    student: StudentInfoInterface;
    onClose: () => void;
}) {
    const {
        currentImage,
        setOriginalImage,
        setCurrentImage,
        removeImage,
        undoImageChange,
        shouldResetProfilePicture,
        deleteProfilePicture,
    } = useProfileImage();
    const pathname = usePathname();
    const showResourcesCompleted = pathname.includes('/teacher/students');
    const [modalLoading, setModalLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [gradeOptions, setGradeOptions] = useState<OptionsInterface[]>([]);
    const methods = useForm<FormValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            name: student.name,
            email: student.email,
            classroom: student.gradeId,
        },
    });
    const { reset, watch } = methods;

    const initialValues = {
        name: student.name,
        email: student.email,
        classroom: student.gradeId,
    };

    const handleReset = () => {
        reset(initialValues);
        undoImageChange();
    };

    useEffect(() => {
        if (!data || gradeOptions.length > 0) {
            return;
        }
        setCurrentImage(student.image);
        setOriginalImage(student.image);
        const getData = async () => {
            try {
                setModalLoading(true);

                const teacherAPIdata = await getAllClassroomsOfTeacherAPI({
                    accessToken: data?.user?.accessToken,
                    teacherId: data?.user?.id,
                });
                if (!teacherAPIdata.ok) {
                    const errorData = await teacherAPIdata.json();
                    throw new Error(
                        errorData?.message ??
                            'An error occurred while fetching video data'
                    );
                }
                const teacherResponseData = await teacherAPIdata.json();
                setGradeOptions(teacherResponseData?.data);
            } catch (error: any) {
                toast.error(
                    error?.message ??
                        'An error occurred while fetching teachers classes'
                );
            } finally {
                setModalLoading(false);
            }
        };

        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const onSubmit = async (values: FormValues) => {
        if (!data) {
            return;
        }

        const changes: any = {};

        if (values.name !== initialValues.name) changes.name = values.name;
        if (values.email !== initialValues.email) changes.email = values.email;
        if (values.classroom !== initialValues.classroom)
            changes.classroomId = values.classroom;
        if (currentImage !== student.image) changes.image = currentImage;

        if (Object.keys(changes).length === 0) {
            toast.info('No changes to update.');
            return;
        }

        try {
            setButtonLoading(true);
            if (shouldResetProfilePicture()) {
                await deleteProfilePicture();
            }

            const APIresponse = await updateClassroomStudentAPI({
                accessToken: data?.user?.accessToken,
                ...changes,
                studentId: student?.id,
            });

            if (APIresponse.status !== 200) {
                throw new Error(
                    'An error occurred while updating student data'
                );
            }
            action('getClassroomStudents');
            toast.success('Student data updated successfully');
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                    'An error occurred while updating student data'
            );
        } finally {
            setButtonLoading(false);
            onClose();
        }
    };

    if (!data) {
        return null;
    }
    return (
        <section className="w-full bg-white h-screen py-4 shadow-lg overflow-y-auto">
            {modalLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <div className="overflow-y-auto px-6 w-full mb-28 mobile:mb-32">
                            <div className="flex justify-end items-end">
                                <div
                                    className="rounded-full bg-white border p-1 cursor-pointer"
                                    onClick={onClose}
                                >
                                    <X size={20} />
                                </div>
                            </div>

                            <div className="flex flex-col items-center w-full">
                                <div className="ml-0 lg:ml-8 mb-6 lg:mb-0">
                                    <div className="border border-orange-200 rounded-full w-fit flex items-center p-3">
                                        <div className="border border-orange-200 rounded-full w-fit flex items-center p-3">
                                            <div className="border-2 border-primary-color rounded-full w-fit flex items-center p-2">
                                                <Image
                                                    src={
                                                        currentImage ||
                                                        DEFAULT_IMAGE
                                                    }
                                                    alt="Avatar"
                                                    className="rounded-full h-[7rem] w-[7rem] object-cover"
                                                    width={150}
                                                    height={150}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <button
                                    type="button"
                                    className="text-dark-gray cursor-pointer justify-center font-semibold mobile:w-full p-2 md:px-6 md:py-3 border rounded-lg mt-3 ml-0 lg:ml-8 mb-6 lg:mb-0 flex items-center space-x-2"
                                    onClick={removeImage}
                                >
                                    <Trash2 color="#E6500D" />
                                    <span>Remove Photo</span>
                                </button> */}
                            </div>

                            <div className="flex items-center mt-4 py-3 px-2 lg:px-5 rounded-lg  border-2 border-primary-color justify-between">
                                <div>
                                    <FileLineChart color="#F59A3B" />
                                    {showResourcesCompleted ? (
                                        <p className="font-medium mt-2">
                                            Resources Completed
                                        </p>
                                    ) : (
                                        <p className="font-medium mt-2">
                                            Performance
                                        </p>
                                    )}
                                </div>
                                {showResourcesCompleted ? (
                                    <p className="font-bold text-lg">
                                        {student.totalFinishedResources} /{' '}
                                        {student.totalResourcesCount}
                                    </p>
                                ) : (
                                    <p className="font-bold text-lg">
                                        {student.performance}%
                                    </p>
                                )}
                            </div>

                            <div className="my-3 h-fit">
                                <div className="flex flex-col space-y-2">
                                    <Label
                                        className="font-semibold"
                                        htmlFor="name"
                                    >
                                        Username
                                    </Label>
                                    <Input
                                        name="name"
                                        placeholder="Enter Name"
                                        type="text"
                                        rules={{
                                            required: {
                                                value: true,
                                                message:
                                                    validationError.REQUIRED_FIELD,
                                            },
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col space-y-2 mt-5">
                                    <Label
                                        className="font-semibold"
                                        htmlFor="email"
                                    >
                                        Email Address
                                    </Label>
                                    <Input
                                        name="email"
                                        placeholder="Enter Email"
                                        type="email"
                                        rules={{
                                            required: {
                                                value: true,
                                                message:
                                                    validationError.REQUIRED_FIELD,
                                            },
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col space-y-2 mt-5">
                                    <Label
                                        className="font-semibold"
                                        htmlFor="classroom"
                                    >
                                        Classroom
                                    </Label>
                                    <Select
                                        additionalClasses="!w-full"
                                        name="classroom"
                                        options={gradeOptions}
                                        selectedOption={student.gradeId}
                                        rules={{
                                            required: {
                                                value: true,
                                                message:
                                                    'Classroom is required',
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full p-4 border bg-white lg:flex lg:justify-between absolute bottom-0">
                            <div
                                className="cursor-pointer w-full mx-1 p-3 py-2 rounded-lg border-2 text-dark-gray text-center mt-1 font-bold"
                                onClick={handleReset}
                            >
                                <button type="button">Discard</button>
                            </div>
                            <button
                                type="submit"
                                className="cursor-pointer w-full mx-1 p-3 py-2 rounded-lg bg-primary-color border-2 border-primary-color text-white text-center mt-1 font-bold"
                            >
                                {buttonLoading ? <ButtonLoader /> : 'Save'}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            )}
        </section>
    );
}

export default ClassroomModal;
