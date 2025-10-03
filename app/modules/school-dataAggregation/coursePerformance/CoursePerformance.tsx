'use client';

import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { ResourceType } from '@/lib/utils';
import Filters from '@/app/components/common/Filters';
import Tabs from '@/app/components/common/test-performance/Tabs';
import PerformanceCard from './PerformanceCard';

interface AssessmentResourcesDetail {
    id: string;
    resourceId: string;
    totalMarks: number;
    numberOfQuestio: number;
    deadline: number;
    createdAt: string;
    updatedAt: string;
}

interface Video {
    id: string;
    resourceId: string;
    thumbnailURL: string;
    topics: Record<string, string>;
    duration: string;
    createdAt: string;
    updatedAt: string;
}

interface Resource {
    id: string;
    name: string;
    url: string;
    type: string;
    topic: string;
    status: string;
    video: Video | null;
    AssessmentResourcesDetail: AssessmentResourcesDetail | null;
}

interface DailyUpload {
    id: string;
    resource: Resource;
}

function CoursePerformance({ dailyUploads }: { dailyUploads: DailyUpload[] }) {
    const [activeTab, setActiveTabLocal] = useState<string>(ResourceType.VIDEO);

    const filteredVideoUploads = dailyUploads?.filter(
        (upload) => upload.resource.video !== null
    );
    const filteredAssessmentUploads = dailyUploads?.filter(
        (upload) => upload.resource.AssessmentResourcesDetail !== null
    );
    const quizUploads = filteredAssessmentUploads?.filter(
        (upload) => upload.resource.type === ResourceType.QUIZ
    );
    const assignmentUploads = filteredAssessmentUploads?.filter(
        (upload) => upload.resource.type === ResourceType.ASSIGNMENT
    );
    const worksheetUploads = filteredAssessmentUploads?.filter(
        (upload) => upload.resource.type === ResourceType.WORKSHEET
    );
    const summarizeAssessmentUploads = filteredAssessmentUploads?.filter(
        (upload) => upload.resource.type === ResourceType.SUMMARIZE_ASSESSMENT
    );
    const formativeAssessmentUploads = filteredAssessmentUploads?.filter(
        (upload) => upload.resource.type === ResourceType.FORMATIVE_ASSESSMENT
    );

    let filteredUploads: DailyUpload[] = [];
    switch (activeTab) {
        case ResourceType.VIDEO:
            filteredUploads = filteredVideoUploads;
            break;
        case ResourceType.ASSIGNMENT:
            filteredUploads = assignmentUploads;
            break;
        case ResourceType.WORKSHEET:
            filteredUploads = worksheetUploads;
            break;
        case ResourceType.QUIZ:
            filteredUploads = quizUploads;
            break;
        case 'Summarize Assessments':
            filteredUploads = summarizeAssessmentUploads;
            break;
        case 'Formative Assessments':
            filteredUploads = formativeAssessmentUploads;
            break;
        default:
            filteredUploads = [];
    }

    return (
        <div className="mt-5">
            <Filters
                text="Course Performance"
                secondButtonText="Student"
                isHideFirstBtn
                isHideSecondBtn
            />
            <Tabs
                activeTab={activeTab}
                setActiveTabLocal={setActiveTabLocal}
                tabOptions={[
                    ResourceType.VIDEO,
                    ResourceType.ASSIGNMENT,
                    ResourceType.WORKSHEET,
                    ResourceType.QUIZ,
                    'Summarize Assessments',
                    'Formative Assessments',
                ]}
            />
            <p className="text-dark-gray font-medium text-lg mt-5">
                <span className="font-semibold text-black">
                    {filteredUploads.length}
                </span>{' '}
                Results
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                {filteredUploads?.length > 0 &&
                    filteredUploads?.map((upload) => (
                        <div key={upload.id}>
                            <PerformanceCard
                                name={upload.resource.name}
                                id={upload.resource.id}
                                // percentage={'100'}
                            />
                        </div>
                    ))}
            </div>
            {filteredUploads?.length === 0 && (
                <div className="flex flex-col items-center justify-center w-full h-72 bg-white rounded-lg shadow-lg">
                    <ShieldAlert size={48} />
                    <p className="text-lg font-semibold mt-4">
                        No Results Found
                    </p>
                </div>
            )}
        </div>
    );
}

export default CoursePerformance;
