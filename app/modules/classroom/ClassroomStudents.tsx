'use client';

import React, { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Pagintaion from '@/app/components/common/Pagintaion';
import StudentsInfoTable from '../students/StudentsInfoTable';

function ClassroomStudents({
    className,
    totalPages,
    students,
}: {
    className: string;
    totalPages: number;
    students: {
        id: string;
        index: number;
        name: string;
        image: string;
        email: string;
        grade: string;
        performance: number;
        gradeId: string;
    }[];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const urlSearchParams = useSearchParams();
    const page = urlSearchParams.get('page') || 1;

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

    return (
        <div>
            <div
                className="border rounded-lg p-4 px-6 mt-5"
                id="classDetailsSection"
            >
                <h1 className="text-xl font-semibold ml-2.5">{className}</h1>
                <StudentsInfoTable
                    students={students}
                    isClassroomTable
                    currentPage={Number(page)}
                    handlePageChange={handlePageChange}
                />
            </div>
            <div className="flex items-center w-full justify-center mt-5">
                {totalPages > 1 && (
                    <Pagintaion
                        currentPage={Number(page) > 0 ? Number(page) : 1}
                        totalPages={totalPages > 0 ? totalPages : 1}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}

export default ClassroomStudents;
