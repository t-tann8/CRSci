import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { getStudentProfileStandardResultsAPI } from '@/app/api/student';
import TestPerformance from '@/app/components/common/test-performance/TestPerformance';

interface APIResponse {
    status: string;
    data?: CourseData;
    message?: string;
}

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

async function TestPerformacePage({
    params,
}: {
    params: { id: string; courseId: string };
}) {
    const data: Session | null = await getServerSession(options);

    if (data) {
        try {
            const response = await getStudentProfileStandardResultsAPI({
                accessToken: data?.user?.accessToken,
                studentId: params.id,
                standardId: params.courseId,
            });

            const APIResponse: APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                return (
                    <section>
                        <TestPerformance
                            isShownFromTeacher
                            APIdata={APIResponse?.data!}
                        />
                    </section>
                );
            }

            if (!response.ok) {
                throw new Error(APIResponse?.message!);
            }
        } catch (error: any) {
            return (
                <UnhandledError
                    error={{
                        message: error?.message,
                        name: error?.name,
                    }}
                />
            );
        }
    }
}

export default TestPerformacePage;
