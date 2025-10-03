/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { X } from 'lucide-react';
import {
    addStudentToClassroomAPI,
    getAllClassroomsOfTeacherAPI,
} from '@/app/api/classroom';
import ModalFooter from '@/app/components/common/ModalFooter';
import StudentIcon from '@/app/assets/icons/StudentIcon';
import { Label } from '@/app/components/ui/label';
import AppDropDown, {
    OptionsInterface,
} from '@/app/components/common/AppDropDown';
import Input from '@/app/components/common/Input';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import PageLoader from '@/app/components/common/PageLoader';
import action from '@/app/action';
import ButtonLoader from '@/app/components/common/ButtonLoader';

interface AddStudentModalProps {
    onClose: () => void;
}

interface FormValues {
    email: string;
    add: string;
}

// eslint-disable-next-line react/function-component-definition
const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose }) => {
    const methods = useForm<FormValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });
    const [selectedOption, setSelectedOption] = useState('');
    const [gradeOptions, setGradeOptions] = useState<OptionsInterface[]>([]);
    const [loader, setLoader] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const { handleSubmit } = methods;
    const { data } = useSession();

    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
        if (!data) {
            return;
        }

        const fetchGradeOptions = async () => {
            try {
                setLoader(true);
                const teacherAPIdata = await getAllClassroomsOfTeacherAPI({
                    accessToken: data.user.accessToken,
                    teacherId: data.user.id,
                });

                if (!teacherAPIdata.ok) {
                    const errorData = await teacherAPIdata.json();
                    throw new Error(
                        errorData?.message ??
                            'An error occurred while fetching classroom data'
                    );
                }

                const teacherResponseData = await teacherAPIdata.json();
                setGradeOptions(teacherResponseData?.data);
                setSelectedOption(teacherResponseData?.data[0]?.label);
            } catch (error: any) {
                toast.error(
                    error.message ??
                        'An error occurred while fetching classrooms'
                );
            } finally {
                setLoader(false);
            }
        };

        fetchGradeOptions();
    }, []);

    // eslint-disable-next-line consistent-return
    const onSubmit = async (formData: FormValues) => {
        try {
            setButtonLoading(true);
            // API call to add student to classroom
            const result = await addStudentToClassroomAPI({
                accessToken: data?.user?.accessToken ?? '',
                email: formData.email,
                classroomId: selectedOption,
            });
            if (result.status !== 'success') {
                return toast.error(result.message);
            }
            await action('SummarizedStudents');
            return toast.success('Student added successfully');
        } catch (error: any) {
            toast.error(
                error.message ?? 'An error occurred while adding student'
            );
        } finally {
            setButtonLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <section className="w-full bg-white h-screen py-4 px-6 shadow-lg">
                {loader ? (
                    <PageLoader />
                ) : (
                    <div>
                        <div className="flex justify-between items-center">
                            <div className="flex my-7">
                                <div className="bg-green-100 px-3 h-fit py-3 rounded-lg">
                                    <StudentIcon
                                        fill="#7AA43E"
                                        width="30"
                                        height="30"
                                    />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <h3 className="text-xl font-semibold mr-1">
                                        Add Student
                                    </h3>
                                    <p className="text-sm text-dark-gray mb-2">
                                        Add Student to Classroom
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-full bg-white border p-1 cursor-pointer">
                                <X size={15} onClick={onClose} />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col space-y-1 mt-5">
                                <Label
                                    className="font-semibold"
                                    htmlFor="email"
                                >
                                    Student Email Address
                                </Label>
                                <Input
                                    name="email"
                                    placeholder="Enter email"
                                    type="email"
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Email is required',
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message:
                                                'Enter a valid email address',
                                        },
                                    }}
                                />
                            </div>

                            <div className="flex flex-col space-y-1 mt-5">
                                <Label className="font-semibold" htmlFor="add">
                                    Add to Classroom?
                                </Label>
                                <AppDropDown
                                    name="add"
                                    options={gradeOptions}
                                    value={selectedOption}
                                    onChange={handleSelectChange}
                                />
                            </div>

                            <div className="text-center mt-8">
                                <ModalFooter
                                    disabled={buttonLoading}
                                    text="Add"
                                    buttonType="submit"
                                    loading={buttonLoading}
                                />
                            </div>
                        </form>
                    </div>
                )}
            </section>
        </FormProvider>
    );
};

export default AddStudentModal;
