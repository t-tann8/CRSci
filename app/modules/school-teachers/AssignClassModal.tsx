/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    useForm,
    FormProvider,
    useFieldArray,
    Controller,
} from 'react-hook-form';
import Image from 'next/image';
import { ModalHeader } from '@/app/components/common/ModalHeader';
import SchoolClassroomIcon from '@/app/assets/icons/SchoolClassroomIcon';
import AppDropDown from '@/app/components/common/AppDropDown';
import { getTeacherDetailsAPI } from '@/app/api/school';
import { useSession } from 'next-auth/react';
import Avatar from '@/app/assets/images/UserImage.svg';
import PageLoader from '@/app/components/common/PageLoader';
import { updateTeacherClassroomsAPI } from '@/app/api/classroom';
import { toast } from 'react-toastify';
import ButtonLoader from '@/app/components/common/ButtonLoader';
import action from '@/app/action';

interface AssignClassModalProps {
    teacher: any;
    onClose: () => void;
}

function AssignClassModal({ teacher, onClose }: AssignClassModalProps) {
    const methods = useForm({
        defaultValues: {
            assignedClasses: [],
        },
    });
    const { control, handleSubmit, setValue } = methods;
    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: 'assignedClasses',
    });
    const [classOptions, setClassOptions] = useState<any>([]);
    const { data } = useSession();
    const [loading, setLoading] = useState(false);
    const [buttonLoader, setButtonLoading] = useState(false);

    useEffect(() => {
        const fetchTeacherDetails = async () => {
            try {
                setLoading(true);
                const response = await getTeacherDetailsAPI(
                    data?.user.accessToken || '',
                    teacher?.id
                );
                if (response && response.data) {
                    const options = response.data.classrooms.map(
                        (classroom: any) => ({
                            id: classroom.id,
                            label: classroom.name,
                            value: classroom.name,
                        })
                    );
                    setClassOptions(options);

                    // Initialize form fields with existing classrooms
                    const existingClassrooms = response?.data?.teachers.map(
                        (classroom: any) => ({
                            id: classroom.id,
                            classId: classroom.name,
                        })
                    );
                    setValue('assignedClasses', existingClassrooms);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeacherDetails();
    }, []);

    const onSubmit = async (formData: any) => {
        // Filter and map assignedClasses to retrieve ids based on classId
        const filteredIds = formData.assignedClasses
            .filter((classroom: any) =>
                classOptions.some(
                    (option: any) => option.label === classroom.classId
                )
            )
            .map((classroom: any) => {
                const option = classOptions.find(
                    (option: any) => option.label === classroom.classId
                );
                return option?.id;
            });

        try {
            setButtonLoading(true);
            const response = await updateTeacherClassroomsAPI({
                accessToken: data?.user.accessToken || '',
                teacherId: teacher.id,
                schoolId: data?.user.schoolId || '',
                classroomIds: filteredIds,
            });
            action('getListTeacherOfSchool');
            return toast.success("Teacher's classrooms updated successfully");
        } catch (error: any) {
            console.log(error);
            return toast.error(error?.response.data.message);
        } finally {
            setButtonLoading(false);
            onClose();
        }
    };

    const handleAddMore = () => {
        append({ classId: classOptions[0]?.value });
    };

    return (
        <FormProvider {...methods}>
            <section className="w-full bg-white h-screen py-4 shadow-lg overflow-y-auto">
                {loading ? (
                    <PageLoader />
                ) : (
                    <div className="px-6 mb-32">
                        <ModalHeader
                            headerText={{
                                heading: teacher?.name,
                                tagline: teacher?.email,
                            }}
                            onClose={onClose}
                        />

                        <div className="flex justify-center items-center mobile:w-full mb-2 ">
                            <div className="lg:mb-0 mr-2">
                                <div className="border border-orange-200 rounded-full w-fit flex items-center p-2">
                                    <div className="border border-orange-200 rounded-full w-fit flex items-center p-2">
                                        <div className="border border-primary-color rounded-full w-fit flex items-center p-2">
                                            <Image
                                                src={teacher.imageUrl || Avatar}
                                                alt="Avatar"
                                                className="rounded-full w-32 h-32"
                                                width={120}
                                                height={120}
                                                objectFit="fill"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex my-4 items-center justify-between p-3 px-5 border-2 border-lime-500 bg-lime-50 rounded-lg">
                            <div className="flex flex-col justify-center">
                                <SchoolClassroomIcon height={40} width={40} />
                                <p className="font-semibold">
                                    Assigned Classrooms
                                </p>
                            </div>
                            <p className="font-semibold text-4xl">
                                {teacher?.assignedClasses}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex justify-between items-center mt-4 relative">
                                <label className="font-medium" htmlFor="invite">
                                    Assign Classes
                                </label>
                                {fields.length !== classOptions.length && (
                                    <button
                                        type="button"
                                        className="font-medium text-primary-color border p-2 rounded-lg hover:bg-primary-color hover:text-white"
                                        onClick={handleAddMore}
                                        disabled={
                                            fields.length ===
                                            classOptions.length
                                        }
                                    >
                                        Add More
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col space-y-4 mt-3">
                                {fields.map((field: any, index: any) => (
                                    <div
                                        key={field.id}
                                        className="flex items-center space-x-4"
                                    >
                                        <Controller
                                            name={
                                                `assignedClasses[${index}].classId` as any
                                            }
                                            control={control}
                                            defaultValue={field.classId}
                                            render={({
                                                field: controllerField,
                                            }) => (
                                                <AppDropDown
                                                    {...controllerField}
                                                    options={classOptions}
                                                    value={
                                                        controllerField.value
                                                    }
                                                    onChange={(value) =>
                                                        controllerField.onChange(
                                                            value
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                        <button
                                            type="button"
                                            className="bg-red-600 hover:bg-red-900 rounded-lg p-2 text-white"
                                            onClick={() => remove(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 w-full border bg-white lg:flex lg:justify-between lg:space-x-4 absolute bottom-0 left-0">
                                <button
                                    type="button"
                                    className="text-dark-gray font-semibold w-full px-5 py-2 border rounded-xl mb-2 lg:mb-0 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                    onClick={onClose}
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="text-white bg-primary-color font-semibold w-full px-5 py-2 border rounded-xl hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    disabled={buttonLoader} // Disable button when loading
                                >
                                    {buttonLoader ? <ButtonLoader /> : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </section>
        </FormProvider>
    );
}

export default AssignClassModal;
