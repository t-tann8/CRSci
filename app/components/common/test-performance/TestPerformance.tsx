'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LucideMoveUpRight } from 'lucide-react';
import { StudentProfileResourceType } from '@/lib/utils';
import Searchbar from '@/app/components/common/Searchbar';
import Tabs from './Tabs';
import PageLoader from '../PageLoader';
import TestPerformanceTable from './TestPerformanceTable';

interface CourseData {
    id: string;
    name: string;
    description: string;
    courseLength: string;
    dailyUploads: DailyUpload[];
    currentTotalWeightage: number;
    currentAcheivedWeightage: number;
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

function TestPerformance({
    isShownFromStudent,
    isShownFromTeacher,
    APIdata,
}: {
    isShownFromStudent?: boolean;
    isShownFromTeacher?: boolean;
    APIdata: CourseData;
}) {
    const { back } = useRouter();
    const { data, status } = useSession();
    const [activeTab, setActiveTabLocal] = useState<string>(
        StudentProfileResourceType.VIDEO
    );

    return (
        <div>
            {status === 'loading' ? (
                <PageLoader />
            ) : (
                <div>
                    {isShownFromStudent && (
                        <Searchbar
                            headerText={data?.user?.name || ''}
                            tagline={data?.user?.email || ''}
                            isShowBackArrow
                            onBackClick={back}
                        />
                    )}
                    <div className="border rounded-lg p-5 mt-10">
                        <div className="flex flex-col mb-4 lg:flex-row justify-between items-center">
                            <h1 className="text-2xl lg:text-3xl font-semibold mb-4 lg:mb-0">
                                {APIdata.name}
                            </h1>

                            <div className="flex items-baseline space-x-2 bg-green-50 py-2 px-4 rounded-lg border border-green-600 text-gray-500 font-medium">
                                <div className="px-[3px] border-2 w-5 h-5 border-green-200 rounded-md flex items-center justify-center">
                                    <LucideMoveUpRight
                                        color="green"
                                        size={10}
                                    />
                                </div>
                                <span className="text-green-600 font-bold text-2xl">
                                    {`${APIdata.currentAcheivedWeightage ?? 0}
                                    of ${APIdata.currentTotalWeightage ?? 0}`}
                                    %
                                </span>
                                <span className="ml-1">
                                    Overall Performance
                                </span>
                            </div>
                        </div>
                        <Tabs
                            activeTab={activeTab}
                            setActiveTabLocal={setActiveTabLocal}
                            tabOptions={[
                                StudentProfileResourceType.VIDEO,
                                StudentProfileResourceType.ASSESSMENT,
                            ]}
                        />
                        <TestPerformanceTable
                            test={APIdata.dailyUploads}
                            activeTab={activeTab}
                            isShownFromStudent={isShownFromStudent}
                            isShownFromTeacher={isShownFromTeacher}
                        />
                    </div>
                    {/* Uncomment and update MyAnswersModal if needed */}
                    {/* <div className="absolute right-0 top-0 z-50 text-sm lg:w-[25%]">
                  <MyAnswersModal />
                </div> */}
                </div>
            )}
        </div>
    );
}

export default TestPerformance;
