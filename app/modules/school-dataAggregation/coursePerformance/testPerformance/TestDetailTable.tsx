'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import QuestionDetailModal from './QuestionDetailModal';

export interface QuestionDetailInterface {
    id: string;
    statement: string;
    totalMarks: number;
    popUpTime: string;
}

interface TestDetailProp {
    data: DataItem[];
    fontSize?: string;
}

interface DataItem {
    id: string;
    name: string;
    video: {
        id: string;
        resourceId: string;
        thumbnailURL: string;
        duration: string;
        questions: QuestionDetailInterface[];
    };
    averageObtainedMarks: number;
    AssessmentResourcesDetail: any;
    totalMarks: number;
}

function TestDetailTable({ data, fontSize }: TestDetailProp) {
    const [isShowDetailModal, setIsShowDetailModal] = useState(false);
    const [selectData, setSelectData] = useState<any>(null);

    const handleDisplayModal = (questionData: any) => {
        setSelectData(questionData);
        setIsShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setIsShowDetailModal(false);
        setSelectData(null);
    };

    return (
        <section>
            <div className="flex mobile:flex-col md:items-center space-x-2 bg-green-50 py-2 px-4 rounded-lg border border-green-600 text-gray-500 font-medium w-[15.5rem] md:w-[21rem] md:absolute md:right-24 top-[9.3rem] mb-6">
                <span className="font-bold text-black">
                    Average Obtain Marks:
                </span>
                <h1 className="text-gray-600 font-semibold">
                    <span className="font-bold text-lg text-gray-700">
                        {data[0]?.averageObtainedMarks}
                    </span>{' '}
                    out of{' '}
                    {data[0]?.AssessmentResourcesDetail?.totalMarks ||
                        data[0]?.totalMarks}
                </h1>
            </div>
            <Table
                className={`text-[${
                    fontSize || '18'
                }px] mobile:text-sm whitespace-nowrap`}
            >
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-dark-gray font-semibold">
                            Q NO.
                        </TableHead>
                        <TableHead className="w-[500px] text-dark-gray font-semibold">
                            Question
                        </TableHead>
                        <TableHead className="text-dark-gray font-semibold">
                            Total Marks
                        </TableHead>
                        <TableHead className="text-dark-gray font-semibold">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((testItem: any, index) => (
                        <React.Fragment key={testItem.id}>
                            {testItem.video === null ? (
                                testItem.AssessmentResourcesDetail ? (
                                    <TableRow className="border-b">
                                        <TableCell className="font-normal">
                                            <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                                {index + 1}
                                            </span>
                                        </TableCell>
                                        <TableCell className="w-[500px] text-dark-gray font-normal">
                                            <span>{testItem.name}</span>
                                        </TableCell>
                                        <TableCell className="text-dark-gray font-normal">
                                            <span>
                                                {
                                                    testItem
                                                        .AssessmentResourcesDetail
                                                        .totalMarks
                                                }
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {testItem.AssessmentResourcesDetail
                                                .assessmentAnswers.length >
                                            0 ? (
                                                <div
                                                    className="mr-2 w-fit bg-light-orange rounded-md p-1 cursor-pointer"
                                                    onClick={() =>
                                                        handleDisplayModal(
                                                            testItem
                                                        )
                                                    }
                                                >
                                                    <Eye
                                                        color="#F59A3B"
                                                        width={18}
                                                        height={18}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="mr-2 w-fit bg-light-orange rounded-md p-1">
                                                    <EyeOff
                                                        color="#F59A3B"
                                                        width={18}
                                                        height={18}
                                                    />
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ) : null
                            ) : (
                                testItem.video.questions.map(
                                    (question: any, qIndex: any) => (
                                        <TableRow
                                            className="border-b"
                                            key={question.id}
                                        >
                                            <TableCell className="font-normal">
                                                <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                                    {qIndex + 1}
                                                </span>
                                            </TableCell>
                                            <TableCell className="w-[500px] text-dark-gray font-normal">
                                                <span>
                                                    {question.statement}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-dark-gray font-normal">
                                                <span>
                                                    {question.totalMarks}
                                                </span>
                                            </TableCell>
                                            {question.answers.length > 0 ? (
                                                <TableCell>
                                                    <div
                                                        className="mr-2 w-fit bg-light-orange rounded-md p-1 cursor-pointer"
                                                        onClick={() =>
                                                            handleDisplayModal(
                                                                question
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            color="#F59A3B"
                                                            width={18}
                                                            height={18}
                                                        />
                                                    </div>
                                                </TableCell>
                                            ) : (
                                                <TableCell>
                                                    <div className="mr-2 w-fit bg-light-orange rounded-md p-1">
                                                        <EyeOff
                                                            color="#F59A3B"
                                                            width={18}
                                                            height={18}
                                                        />
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )
                                )
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
            {isShowDetailModal && (
                <div className="fixed right-0 top-0 z-50 w-full md:w-[60%] lg:w-[30%]">
                    <QuestionDetailModal
                        resourceData={selectData}
                        onClose={handleCloseModal}
                    />
                </div>
            )}
        </section>
    );
}

export default TestDetailTable;
