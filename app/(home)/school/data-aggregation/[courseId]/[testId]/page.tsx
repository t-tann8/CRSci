import React from 'react';
import { Metadata } from 'next';
import { Session, getServerSession } from 'next-auth';
import { getSchoolResourceResultsAPI } from '@/app/api/school';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import TestPerformance from '@/app/modules/school-dataAggregation/coursePerformance/testPerformance/TestPerformance';

export const metadata: Metadata = {
    title: 'Test Performance',
    description: 'View the performance details for the selected test.',
};

interface ApiResponse {
    status: string;
    statusCode: number;
    message: string;
    data: DataItem[];
}

interface DataItem {
    id: string;
    performanceDetails: PerformanceDetail[];
}

interface PerformanceDetail {
    studentId: string;
    score: number;
    feedback: string;
}

interface TestPerformancePageProps {
    params: { testId: string; courseId: string };
    searchParams: { [key: string]: string | undefined };
}

async function TestPerformancePage({
    params,
    searchParams,
}: TestPerformancePageProps) {
    const { teacherId = '' } = searchParams;
    const session: Session | null = await getServerSession(options);
    if (session) {
        try {
            const response: ApiResponse = await getSchoolResourceResultsAPI(
                session.user.accessToken,
                session?.user?.schoolId || '',
                params.testId,
                teacherId,
                params.courseId
            );
            if (response.status !== 'error') {
                return <TestPerformance APIdata={response?.data} />;
            }
            throw new Error(response.message);
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

export default TestPerformancePage;
