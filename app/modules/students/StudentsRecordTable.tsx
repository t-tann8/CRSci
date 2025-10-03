'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
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

interface SummarizedStandardResult {
    standardId: string;
    standardName: string;
    totalResources: number;
    finishedResources: number;
}

interface StudentsRecordProp {
    students: SummarizedStandardResult[];
    fontSize?: string;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});
function StudentsRecordTable({ students, fontSize }: StudentsRecordProp) {
    const { push } = useRouter();
    const path = usePathname();

    const handleClick = (id: string) => {
        push(`${path}/${id}`);
    };

    return (
        <Table
            className={`text-[${
                fontSize || '18'
            }px] mobile:text-sm whitespace-nowrap ${poppins.className}`}
        >
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px] text-dark-gray font-semibold text-sm">
                        SNO.
                    </TableHead>
                    <TableHead className=" text-dark-gray font-semibold text-sm">
                        Standard Name
                    </TableHead>
                    <TableHead className="text-dark-gray font-semibold text-sm">
                        Total Resources
                    </TableHead>
                    <TableHead className="text-dark-gray font-semibold text-sm">
                        Finished Resources
                    </TableHead>
                    <TableHead className="text-dark-gray font-semibold text-sm">
                        Action
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students?.length > 0 ? (
                    students.map((resource, index) => (
                        <TableRow
                            className="border-none"
                            key={resource.standardId}
                        >
                            <TableCell className="font-normal text-sm">
                                <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                    {index + 1}
                                </span>
                            </TableCell>
                            <TableCell className="text-dark-gray font-normal text-sm">
                                <span>{resource.standardName}</span>
                            </TableCell>

                            <TableCell className="text-dark-gray font-normal text-sm">
                                {resource.totalResources}
                            </TableCell>
                            <TableCell className="text-dark-gray font-normal text-sm">
                                {resource.finishedResources}
                            </TableCell>
                            <TableCell className="flex justify-start items-center p-0 mt-3 ml-3 gap-2">
                                <div
                                    className="bg-light-orange p-1 rounded-md cursor-pointer"
                                    onClick={() =>
                                        handleClick(resource.standardId)
                                    }
                                >
                                    <Eye
                                        color="#F59A3B"
                                        width={18}
                                        height={18}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center ">
                            No data found
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
export default StudentsRecordTable;
