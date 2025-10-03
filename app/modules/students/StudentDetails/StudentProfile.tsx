'use client';

import React from 'react';
import Image from 'next/image';
import DialogBox from '@/app/components/common/DialogBox';
import { useSession } from 'next-auth/react';
import { removeStudentFromClassroomAPI } from '@/app/api/classroom';
import { useRouter } from 'next/navigation';
import action from '@/app/action';
import { toast } from 'react-toastify';

export interface Student {
    name: string;
    email: string;
    image: string;
    classroomName: string;
    totalResourcesCount: number;
    finishedResourcesCount: number;
    classroomStudentId: string;
}

function StudentProfile({ student }: { student: Student }) {
    const [isShowDialog, setIsShowDialog] = React.useState(false);
    const [isLoading, setIsloading] = React.useState(false);
    const { data } = useSession();
    const { push } = useRouter();

    // eslint-disable-next-line consistent-return
    const handleDeleteStudent = async () => {
        try {
            setIsloading(true);
            await removeStudentFromClassroomAPI({
                accessToken: data?.user?.accessToken || '',
                classroomStudentId: student?.classroomStudentId,
            });
            toast.success('Student dropped out successfully!');
            await action('SummarizedStudents');
            return push('/teacher/students');
        } catch (error: any) {
            return toast.error(
                error?.response.data.message || 'Something went wrong'
            );
        } finally {
            setIsShowDialog(false);
            setIsloading(false);
        }
    };

    const handleModal = () => {
        setIsShowDialog(!isShowDialog);
    };
    return (
        <>
            {/* student profile */}
            <section className="flex mobile:flex-col mt-8 flex-row lg:items-center justify-between">
                <h1 className="font-semibold text-xl mb-4 lg:mb-0 lg:mr-4">
                    {student?.name}
                </h1>

                <div className="mobile:w-full mobile:justify-end mobile:flex">
                    <div
                        className="border rounded-xl p-3 text-dark-gray text-center mobile:w-fit cursor-pointer hover:bg-primary-color hover:text-white"
                        onClick={handleModal}
                    >
                        <p className=" font-semibold text-md ">Drop Out</p>
                    </div>
                </div>
            </section>
            <div className="flex flex-col lg:flex-row items-center shadow-[0px_4px_20px_0px_rgb(0,0,0,0.05)] rounded-lg py-5 mt-8">
                <div className="ml-0 lg:ml-8 mb-6 lg:mb-0">
                    <div className="border border-orange-200 rounded-full w-fit flex items-center p-3">
                        <div className="border border-orange-200 rounded-full w-fit flex items-center p-3">
                            <div className="border border-primary-color rounded-full w-fit flex items-center p-2">
                                <Image
                                    src={student?.image}
                                    alt="Avatar"
                                    className="rounded-full w-32 h-32 object-cover"
                                    width={150}
                                    height={150}
                                    objectFit="contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information */}
                <div className="lg:ml-8 mobile:pl-4 w-full lg:w-[45%] md:w-[85%] md:justify-between md:flex">
                    <div className="flex-col mb-4 lg:mb-0">
                        <div>
                            <h1 className="text-dark-gray font-medium">Name</h1>
                            <h1 className="font-medium text-lg">
                                {student?.name}
                            </h1>
                        </div>
                        <div className="mt-4">
                            <h1 className="text-dark-gray font-medium">
                                Email
                            </h1>
                            <h1 className="font-medium text-lg">
                                {student?.email}
                            </h1>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div>
                            <h1 className="text-dark-gray font-medium">
                                Grade
                            </h1>
                            <h1 className="font-semibold text-lg">
                                {student?.classroomName}
                            </h1>
                        </div>
                        <div className="mt-4">
                            <h1 className="text-dark-gray font-medium">
                                Overall Performance
                            </h1>
                            <h1 className="font-semibold text-lg">
                                {`${student?.finishedResourcesCount} of ${student?.totalResourcesCount} `}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            {isShowDialog && (
                <DialogBox
                    isOpen={isShowDialog}
                    message={`Are you sure you want to drop out ${
                        student?.name || 'this Student'
                    } from ${student?.classroomName}?`}
                    onYes={handleDeleteStudent}
                    onNo={handleModal}
                    loader={isLoading}
                />
            )}
        </>
    );
}

export default StudentProfile;
