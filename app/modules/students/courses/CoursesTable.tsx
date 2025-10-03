'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { Poppins } from 'next/font/google';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import TestReportModal from './TestReportModal';

export interface CoursesListInterface {
    id: number;
    testName: string;
    result: string;
    score: string;
}

interface CoursesTableProps {
    courses: CoursesListInterface[];
    fontSize?: string;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});
function CoursesTable({ courses, fontSize }: CoursesTableProps) {
    const [isDisplayCourseModalOpen, setIsDisplayModalOpen] = useState(false);

    const { push } = useRouter();
    const pathname = usePathname();

    const handleClick = (id: number) => {
        push(`${pathname}/${id}/test-performance`);
    };

    const handleOpenCourseModal = () => {
        setIsDisplayModalOpen(true);
    };

    const handleCloseCourseModal = () => {
        setIsDisplayModalOpen(false);
    };
    return (
        <section>
            <Table
                className={`text-[${fontSize || '18'}px] mobile:text-sm ${
                    poppins.className
                }`}
            >
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-dark-gray font-semibold text-center">
                            SNO.
                        </TableHead>
                        <TableHead className=" text-dark-gray font-semibold text-center">
                            Test Name
                        </TableHead>
                        <TableHead className="text-dark-gray font-semibold text-center">
                            Result
                        </TableHead>
                        <TableHead className="text-dark-gray font-semibold text-center">
                            Score
                        </TableHead>

                        <TableHead className="text-dark-gray font-semibold text-center">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {courses.map((course, index) => (
                        <TableRow className="border-none" key={course.id}>
                            <TableCell className="font-normal text-center">
                                <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                    {index + 1}
                                </span>
                            </TableCell>
                            <TableCell className="text-dark-gray font-normal text-center">
                                <span>{course.testName}</span>
                            </TableCell>

                            <TableCell className="text-dark-gray font-normal text-center">
                                {course.result}
                            </TableCell>
                            <TableCell className="text-dark-gray font-normal text-center">
                                {course.score}%
                            </TableCell>

                            <TableCell className="flex justify-center items-center text-center">
                                <div
                                    className="mr-2 bg-light-orange rounded-md p-1 cursor-pointer"
                                    onClick={() => handleClick(index)}
                                >
                                    <Eye
                                        color="#F59A3B"
                                        width={18}
                                        height={18}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
}
export default CoursesTable;
