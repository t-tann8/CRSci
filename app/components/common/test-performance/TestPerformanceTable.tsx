'use client';

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
import { ResourceType, StudentProfileResourceType } from '@/lib/utils';
import MyAnswersModal from '@/app/modules/profile/MyAnswersModal';
import TestReportModal from '@/app/modules/students/courses/TestReportModal';

export interface TestRecordInterface {
    id: number;
    question: string;
    answer: string;
}

interface TestPerformanceProp {
    test: DailyUpload[];
    activeTab: string;
    fontSize?: string;
    isShownFromStudent?: boolean;
    isShownFromTeacher?: boolean;
}

interface DailyUpload {
    id: string;
    accessDate: string;
    weightage: number;
    resource: Resource;
    accessible: boolean;
    performance: number;
    yetToMarkWeightage: number;
    unAnsweredWeightage: number;
}

interface Resource {
    id: string;
    name: string;
    type: string;
    video: Video | null;
    AssessmentResourcesDetail: AssessmentDetail | null;
}

interface Video {
    id: string;
    questions: Question[];
}

interface Question {
    id: string;
    statement: string;
    totalMarks: number;
    answers: Answer[];
    options?: { [key: string]: string };
    correctOption?: string;
    correctOptionExplanation?: string;
}

interface Answer {
    obtainedMarks: number;
    answer?: string;
}

interface AssessmentDetail {
    id: string;
    totalMarks: number;
    deadline: number;
    assessmentAnswers: AssessmentAnswer[];
}

interface AssessmentAnswer {
    obtainedMarks: number;
    answerURL: string;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});
function TestPerformanceTable({
    test,
    activeTab,
    fontSize,
    isShownFromStudent,
    isShownFromTeacher,
}: TestPerformanceProp) {
    const [currentTest, setCurrentTest] = useState<{
        showModal: boolean;
        testDetails?: DailyUpload;
    }>({ showModal: false });
    return (
        <section>
            <Table
                className={`text-[${
                    fontSize || '18'
                }px] mobile:text-sm whitespace-nowrap ${poppins.className}`}
            >
                <TableHeader className="whitespace-nowrap">
                    <TableRow>
                        <TableHead className=" text-dark-gray font-semibold">
                            Q NO.
                        </TableHead>
                        <TableHead className=" text-dark-gray font-semibold">
                            {activeTab === StudentProfileResourceType.VIDEO
                                ? 'Video'
                                : 'Assessment'}
                        </TableHead>
                        <TableHead className="text-dark-gray font-semibold">
                            Performance
                        </TableHead>

                        <TableHead className="text-dark-gray font-semibold">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {test
                        ?.filter(
                            (dailyUpload) =>
                                (activeTab ===
                                    StudentProfileResourceType.VIDEO &&
                                    dailyUpload.resource.type ===
                                        ResourceType.VIDEO) ||
                                (activeTab !==
                                    StudentProfileResourceType.VIDEO &&
                                    dailyUpload.resource.type !==
                                        ResourceType.VIDEO)
                        )
                        ?.map((test, index) => (
                            <TableRow className="border-none" key={test.id}>
                                <TableCell className="font-normal">
                                    <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                        {index + 1}
                                    </span>
                                </TableCell>
                                <TableCell className="text-dark-gray font-normal">
                                    <span>{test.resource.name}</span>
                                </TableCell>

                                <TableCell className="text-dark-gray font-normal">
                                    {test.performance ?? 0} /{' '}
                                    {test.weightage ?? 0}
                                </TableCell>

                                <TableCell>
                                    <div
                                        className="w-7 bg-light-orange rounded-lg p-1 cursor-pointer"
                                        onClick={() => {
                                            const testDetails = test; // Capture the current test's details
                                            if (isShownFromStudent) {
                                                setCurrentTest({
                                                    showModal: true,
                                                    testDetails,
                                                });
                                            } else if (isShownFromTeacher) {
                                                setCurrentTest({
                                                    showModal: true,
                                                    testDetails,
                                                });
                                            }
                                        }}
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
            {currentTest.showModal && isShownFromStudent && (
                <div className="fixed right-0 top-0 z-50 text-sm md:w-[60%] lg:w-[30%]">
                    <MyAnswersModal
                        onClose={() =>
                            setCurrentTest({
                                showModal: false,
                            })
                        }
                        test={currentTest.testDetails!}
                    />
                </div>
            )}

            {currentTest.showModal && isShownFromTeacher && (
                <div className="fixed right-0 top-0 z-50 text-sm md:w-[60%] lg:w-[30%]">
                    <TestReportModal
                        test={currentTest.testDetails!}
                        onClose={() =>
                            setCurrentTest({
                                showModal: false,
                            })
                        }
                    />
                </div>
            )}
        </section>
    );
}
export default TestPerformanceTable;
