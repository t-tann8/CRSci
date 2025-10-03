'use client';

import { Session } from 'next-auth';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { X } from 'lucide-react';
import action from '@/app/action';
import { validationError } from '@/lib/utils';
import Input from '@/app/components/common/Input';
import { ErrorMessage } from '@hookform/error-message';
import { Label } from '@/app/components/ui/label';
import Select from '@/app/components/common/DropDown';
import PageLoader from '@/app/components/common/PageLoader';
import ModalFooter from '@/app/components/common/ModalFooter';
import { ModalHeader } from '@/app/components/common/ModalHeader';
import { OptionsInterface } from '@/app/components/common/AppDropDown';
import {
    assignStandardToClassroomsAPI,
    getAllClassroomsOfTeacherAPI,
} from '@/app/api/classroom';
import { getSummarizedStandardAPI } from '@/app/api/standard';
import CourseCard from './CourseCard';

interface FormValues {
    selectedClasses: {
        classroomId: string;
        startDate: string;
    }[];
}

function AssignCourseModal({
    data,
    onClose,
    standardId,
}: {
    data: Session | null;
    onClose: () => void;
    standardId: string;
}) {
    const [buttonLoading, setButtonLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [standardSummary, setStandardSummary] = useState<{
        name: string;
        courseLength: string;
        totalVideoUploads: string;
        totalNonVideoUploads: string;
    }>({
        name: '',
        courseLength: '',
        totalVideoUploads: '',
        totalNonVideoUploads: '',
    });
    const [gradeOptions, setGradeOptions] = useState<OptionsInterface[]>([]);

    const methods = useForm<FormValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            selectedClasses: [],
        },
    });

    const {
        formState: { errors, isValid },
        trigger,
        watch,
        control,
        reset,
    } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'selectedClasses',
    });

    const filteredGradeOptions = gradeOptions?.filter(
        (classItem: OptionsInterface) =>
            !watch('selectedClasses')?.some(
                (selected) => selected.classroomId === classItem.label
            )
    );

    const onSubmit = async (formData: FormValues) => {
        try {
            trigger('selectedClasses');
            setButtonLoading(true);

            // Prepare data for API
            const classCourses = formData.selectedClasses.map(
                ({ classroomId, startDate }) => ({
                    classroomId,
                    startDate,
                })
            );

            const response = await assignStandardToClassroomsAPI({
                accessToken: data?.user?.accessToken || '',
                standardId,
                classCourses,
            });

            if (response.status !== 200) {
                toast.error(
                    response?.data?.message ||
                        'An error occurred while assigning standard to class'
                );
            }
            action('getClassesAndCourses');
            toast.success('Standard assigned successfully');
            onClose();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    'An error occurred while assigning standard to class'
            );
        } finally {
            setButtonLoading(false);
        }
    };

    useEffect(() => {
        if (!data || standardSummary.name.length) {
            return;
        }
        const getData = async () => {
            try {
                setModalLoading(true);
                const standardAPIdata = await getSummarizedStandardAPI({
                    accessToken: data?.user?.accessToken,
                    standardId,
                });
                if (!standardAPIdata.ok) {
                    const errorData = await standardAPIdata.json();
                    throw new Error(
                        errorData?.message ??
                            'An error occurred while fetching video data'
                    );
                }
                const standardResponseData = await standardAPIdata.json();
                setStandardSummary({
                    name: standardResponseData?.data?.name,
                    courseLength: standardResponseData?.data?.courseLength,
                    totalVideoUploads:
                        standardResponseData?.data?.totalVideoUploads,
                    totalNonVideoUploads:
                        standardResponseData?.data?.totalNonVideoUploads,
                });

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
                reset({
                    selectedClasses: [
                        {
                            classroomId: teacherResponseData?.data[0].label,
                            startDate: '',
                        },
                    ],
                });
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message ||
                        'An error occurred while fetching standard classrooms'
                );
            } finally {
                setModalLoading(false);
            }
        };

        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    if (!data) {
        return null;
    }

    return (
        <section className="w-full bg-white h-screen py-4 shadow-lg overflow-y-scroll">
            {modalLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <div className="h-[95%] overflow-y-auto px-6">
                            <ModalHeader
                                headerText={{
                                    heading: 'Assign Course',
                                    tagline: 'Assign Course to your Class!',
                                }}
                                onClose={onClose}
                            />

                            <div className="flex flex-col w-full">
                                <CourseCard
                                    name={standardSummary.name}
                                    courseLength={standardSummary.courseLength}
                                    videoCount={
                                        standardSummary.totalVideoUploads
                                    }
                                    otherResourcesCount={
                                        standardSummary.totalNonVideoUploads
                                    }
                                />
                                <div className="h-96 overflow-y-scroll">
                                    <div className="my-3 w-full">
                                        <Label htmlFor="selectedClasses">
                                            Select Class To Assign
                                        </Label>
                                        {fields.map((field, index) => (
                                            <div key={field.id}>
                                                <div className="flex gap-1">
                                                    <div className="mt-4 grow">
                                                        <Select
                                                            additionalClasses="!w-full z-50"
                                                            name={`selectedClasses.${index}.classroomId`}
                                                            options={
                                                                gradeOptions
                                                            }
                                                            selectedOption={
                                                                field.classroomId
                                                            }
                                                            rules={{
                                                                validate: (
                                                                    currentClassroomId: string
                                                                ) => {
                                                                    const allSelectedClassroomIds =
                                                                        watch(
                                                                            'selectedClasses'
                                                                        ).map(
                                                                            (
                                                                                selected
                                                                            ) =>
                                                                                selected.classroomId
                                                                        );
                                                                    const previousSelectedClassroomIds =
                                                                        allSelectedClassroomIds.slice(
                                                                            0,
                                                                            index
                                                                        );
                                                                    return (
                                                                        !previousSelectedClassroomIds.includes(
                                                                            currentClassroomId
                                                                        ) ||
                                                                        'This value has been selected before'
                                                                    );
                                                                },
                                                            }}
                                                        />
                                                    </div>
                                                    <button
                                                        className="flex-none cursor-pointer mt-4 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 z-50"
                                                        type="button"
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <div className="flex gap-1">
                                                    <div className="mt-4 grow">
                                                        <Input
                                                            name={`selectedClasses.${index}.startDate`}
                                                            additionalClasses="!w-full"
                                                            type="date"
                                                            rules={{
                                                                required: {
                                                                    value: true,
                                                                    message:
                                                                        validationError.REQUIRED_FIELD,
                                                                },
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="text-red-500 text-xs mt-2">
                                                        <ErrorMessage
                                                            errors={errors}
                                                            name={`selectedClasses.${index}.classroomId`}
                                                            render={({
                                                                message,
                                                            }) => (
                                                                <p className="flex items-center">
                                                                    <X
                                                                        size={
                                                                            20
                                                                        }
                                                                        color="#E6500D"
                                                                    />
                                                                    {message}
                                                                </p>
                                                            )}
                                                        />
                                                        <ErrorMessage
                                                            errors={errors}
                                                            name={`selectedClasses.${index}.startDate`}
                                                            render={({
                                                                message,
                                                            }) => (
                                                                <p className="flex items-center">
                                                                    <X
                                                                        size={
                                                                            20
                                                                        }
                                                                        color="#E6500D"
                                                                    />
                                                                    {message}
                                                                </p>
                                                            )}
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {filteredGradeOptions.length > 0 && (
                                        <div className="flex flex-col items-end">
                                            <div
                                                className="flex border p-2 w-28 justify-center text-dark-gray rounded-lg items-center mt-4  hover:bg-primary-color hover:text-white z-50"
                                                onClick={() =>
                                                    append({
                                                        classroomId:
                                                            filteredGradeOptions[0]
                                                                .label,
                                                        startDate: '',
                                                    })
                                                }
                                            >
                                                Add More
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <ModalFooter
                            text="Assign"
                            loading={buttonLoading}
                            disabled={!isValid}
                        />
                    </form>
                </FormProvider>
            )}
        </section>
    );
}

export default AssignCourseModal;
