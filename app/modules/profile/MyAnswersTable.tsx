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

// export interface MyAnswers {
//     question: string;
//     id: number;
//     topicName: string;
//     correctAnswer: string;
//     score: string;
// }
interface SummarizedStandardResult {
    standardId: string;
    standardName: string;
    totalWeightage: number;
    obtainedWeightage: number;
}

interface MyAnswersProp {
    myRecord: SummarizedStandardResult[];
    fontSize?: string;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});
function MyAnswersTable({ myRecord, fontSize }: MyAnswersProp) {
    const { push } = useRouter();
    const path = usePathname();

    const handleClick = (id: string) => {
        push(`${path}/${id}`);
    };

    return (
        <Table
            className={`text-[${fontSize || '18'}px] mobile:text-sm ${
                poppins.className
            }`}
        >
            <TableHeader className=" whitespace-nowrap">
                <TableRow>
                    <TableHead className="text-dark-gray font-bold">
                        SNO.
                    </TableHead>
                    <TableHead className="text-dark-gray font-bold">
                        Standard Name
                    </TableHead>
                    <TableHead className="text-dark-gray font-bold">
                        Obtained Marks
                    </TableHead>
                    <TableHead className="text-dark-gray font-bold">
                        Total Marks
                    </TableHead>
                    <TableHead className="text-dark-gray font-bold">
                        Action
                    </TableHead>
                </TableRow>
            </TableHeader>
            {myRecord?.length > 0 ? (
                <TableBody className="whitespace-nowrap">
                    {myRecord?.map((record, index) => (
                        <TableRow
                            className="border-none"
                            key={record.standardId}
                        >
                            <TableCell className="font-medium">
                                <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                    {index + 1}
                                </span>
                            </TableCell>
                            <TableCell className="font-medium">
                                {record.standardName}
                            </TableCell>

                            <TableCell className="text-dark-gray ">
                                {record.obtainedWeightage}
                            </TableCell>
                            <TableCell className="text-dark-gray ">
                                {record.totalWeightage}
                            </TableCell>
                            <TableCell>
                                <div
                                    className="p-1 w-7 bg-light-orange rounded-lg cursor-pointer"
                                    onClick={() =>
                                        handleClick(record.standardId)
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
                    ))}
                </TableBody>
            ) : (
                <TableBody className="w-full">
                    <TableRow>
                        <TableCell className="text-center py-12" colSpan={5}>
                            No Standard found
                        </TableCell>
                    </TableRow>
                </TableBody>
            )}
        </Table>
    );
}
export default MyAnswersTable;
