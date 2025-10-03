'use client';

import React from 'react';
import { Poppins } from 'next/font/google';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';

export interface StudentPerformanceInterface {
    id: number;
    question: string;
    learningStandard: string;
    result: string;
}

interface StudentPerformanceProp {
    students: StudentPerformanceInterface[];
    fontSize?: string;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});
function StudentPerformanceTable({
    students,
    fontSize,
}: StudentPerformanceProp) {
    return (
        <Table
            className={`text-[${fontSize || '18'}px] mobile:text-sm ${
                poppins.className
            }`}
        >
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px] text-dark-gray font-semibold">
                        Q NO.
                    </TableHead>
                    <TableHead className="w-[600px]   text-dark-gray font-semibold">
                        Question
                    </TableHead>
                    <TableHead className=" text-dark-gray font-semibold">
                        Learning Standard
                    </TableHead>

                    <TableHead className="text-dark-gray font-semibold">
                        Result
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map((student, index) => (
                    <TableRow className="border-b " key={student.id}>
                        <TableCell className="font-normal">
                            <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                {index + 1}
                            </span>
                        </TableCell>
                        <TableCell className=" w-[600px] text-dark-gray font-normal  lg:pr-10">
                            <span>{student.question}</span>
                        </TableCell>

                        <TableCell className="text-dark-gray font-normal ">
                            {student.learningStandard}
                        </TableCell>

                        <TableCell
                            className={`text-dark-gray font-normal ${
                                student.result.toLowerCase() === 'fail'
                                    ? 'text-red-500'
                                    : 'text-green-600'
                            }`}
                        >
                            {student.result}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
export default StudentPerformanceTable;
