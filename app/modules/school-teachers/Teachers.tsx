'use client';

import React, { useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Searchbar from '@/app/components/common/Searchbar';
import Pagintaion from '@/app/components/common/Pagintaion';
import userImage from '@/app/assets/images/UserImage.svg';
import TeachersTable, { TeacherInterface } from './TeachersTable';
import AddTeacherModal from './AddTeacherModal';

// export const teachersData: TeacherInterface[] = [
//     {
//         id: 1,
//         imageUrl: userImage as string,
//         name: 'John',
//         email: 'john.doe@example.com',
//         assignedClasses: '3',
//     },
//     {
//         id: 2,
//         imageUrl: userImage as string,
//         name: 'John',
//         email: 'john.doe@example.com',
//         assignedClasses: '3',
//     },
//     {
//         id: 3,
//         imageUrl: userImage as string,
//         name: 'John',
//         email: 'john.doe@example.com',
//         assignedClasses: '3',
//     },
//     {
//         id: 4,
//         imageUrl: userImage as string,
//         name: 'John',
//         email: 'john.doe@example.com',
//         assignedClasses: '3',
//     },
//     {
//         id: 5,
//         imageUrl: userImage as string,
//         name: 'John',
//         email: 'john.doe@example.com',
//         assignedClasses: '3',
//     },
//     {
//         id: 6,
//         imageUrl: userImage as string,
//         name: 'John',
//         email: 'john.doe@example.com',
//         assignedClasses: '3',
//     },
//     {
//         id: 7,
//         imageUrl: userImage as string,
//         name: 'John',
//         email: 'john.doe@example.com',
//         assignedClasses: '3',
//     },
//     {
//         id: 8,
//         imageUrl: userImage as string,
//         name: 'John',
//         email: 'john.doe@example.com',
//         assignedClasses: '3',
//     },
// ];

interface APIUserInterface {
    id: string;
    name: string;
    email: string;
    image: string;
}

interface APITeacherInterface {
    classroomCount: string;
    User: APIUserInterface;
}

interface APIPaginationInterface {
    totalRecords: number;
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

function Teachers({
    teachers,
    pagination,
}: {
    teachers: APITeacherInterface[];
    pagination: APIPaginationInterface;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const urlSearchParams = useSearchParams();
    const page = urlSearchParams.get('page') || 1;
    const [isAddTeacherModalVisible, setAddTeacherModalVisible] =
        useState(false);

    const mapApiTeacherToTeacher = (
        apiTeachers: APITeacherInterface[]
    ): TeacherInterface[] =>
        apiTeachers?.map((apiTeacher) => ({
            id: apiTeacher?.User.id,
            name: apiTeacher?.User.name,
            email: apiTeacher?.User.email,
            assignedClasses: apiTeacher?.classroomCount,
            imageUrl: apiTeacher?.User.image,
        }));
    const transformedTeachers: TeacherInterface[] =
        mapApiTeacherToTeacher(teachers);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(urlSearchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [urlSearchParams]
    );

    const handlePageChange = (page: number) => {
        router.push(`${pathname}?${createQueryString('page', `${page}`)}`);
    };

    const handleAddTeacherClick = () => {
        setAddTeacherModalVisible(true);
    };

    const handleCloseModal = () => {
        setAddTeacherModalVisible(false);
    };
    return (
        <section className="px-2 lg:px-4">
            <Searchbar
                headerText="Teachers"
                tagline="Teachers in your School"
            />
            <div className="border rounded-lg p-4 px-6   ">
                <div className="flex mobile:flex-col justify-between px-1 mb-6 mobile:items-start items-center">
                    <h1 className="text-xl font-semibold">Teachers</h1>
                    <div
                        className="cursor-pointer border rounded-lg px-3 py-2 text-white bg-primary-color font-medium mobile:mt-2"
                        onClick={handleAddTeacherClick}
                    >
                        Add Teacher
                    </div>
                </div>
                <div className="mt-4">
                    <TeachersTable
                        teachers={transformedTeachers}
                        fontSize="12"
                    />
                </div>
            </div>
            {transformedTeachers?.length > 10 && (
                <div className="flex items-center w-full justify-center mt-5">
                    <Pagintaion
                        currentPage={Number(page) > 0 ? Number(page) : 1}
                        totalPages={
                            pagination?.totalPages > 0
                                ? pagination.totalPages
                                : 1
                        }
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* <div className="fixed right-0 top-0 z-50 w-full lg:w-[25%]">
                <AssignClassModal />
            </div> */}
            {isAddTeacherModalVisible && (
                <div className="fixed right-0 top-0 z-50 w-full md:w-[60%] lg:w-[30%]">
                    <AddTeacherModal onClose={handleCloseModal} />
                </div>
            )}
        </section>
    );
}

export default Teachers;
