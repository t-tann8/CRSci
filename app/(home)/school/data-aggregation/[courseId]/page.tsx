import React from 'react';
import { Metadata } from 'next';
import { Session, getServerSession } from 'next-auth';
import { getSchoolStandardResourcesAPI } from '@/app/api/school';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import CoursePerformance from '@/app/modules/school-dataAggregation/coursePerformance/CoursePerformance';

export const metadata: Metadata = {
    title: 'Data Aggregation',
    description:
        'Review the performance of standards in school with our aggregated data insights.',
};
interface ApiResponse {
    status: string;
    statusCode: number;
    message: string;
    data: DataItem[];
}

interface DataItem {
    id: string;
    dailyUploads: DailyUpload[];
}

interface DailyUpload {
    id: string;
    resource: Resource;
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

interface Video {
    id: string;
    resourceId: string;
    thumbnailURL: string;
    topics: Record<string, string>;
    duration: string;
    createdAt: string;
    updatedAt: string;
}

interface AssessmentResourcesDetail {
    id: string;
    resourceId: string;
    totalMarks: number;
    numberOfQuestio: number;
    deadline: number;
    createdAt: string;
    updatedAt: string;
}

async function coursePerformancePage({
    params,
}: {
    params: { courseId: string };
}) {
    const data: Session | null = await getServerSession(options);

    if (data) {
        try {
            const response = await getSchoolStandardResourcesAPI({
                accessToken: data?.user?.accessToken,
                standardId: params.courseId || '',
            });

            const APIResponse: ApiResponse = await response.json();

            if (APIResponse.status !== 'error') {
                const APIdata = APIResponse?.data[0];
                return (
                    <CoursePerformance
                        dailyUploads={APIdata?.dailyUploads || []}
                    />
                );
            }

            if (!response.ok) {
                throw new Error(APIResponse?.message);
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

    return (
        <UnhandledError
            error={{
                message: 'Token Expired, Please Login Again',
                name: 'Token Expired',
            }}
        />
    );
}

export default coursePerformancePage;
