import React from 'react';
import { Metadata } from 'next';
import { Session, getServerSession } from 'next-auth';
import { getSchoolCoursesAPI } from '@/app/api/school';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import AllCourses from '@/app/modules/school-dataAggregation/AllCourses';

export const metadata: Metadata = {
    title: 'Data Aggregation',
    description:
        'Review the performance of standards in school with our aggregated data insights.',
};

interface Standard {
    id: string;
    name: string;
    description: string;
    courseLength: string;
    createdAt: string;
    updatedAt: string;
}

interface Data {
    standards: Standard[];
}

interface ApiResponse {
    status: string;
    statusCode: number;
    message: string;
    data: Data;
}
async function DataAggregationPage() {
    const data: Session | null = await getServerSession(options);

    if (data) {
        try {
            const response = await getSchoolCoursesAPI({
                accessToken: data?.user?.accessToken,
                schoolId: data?.user?.schoolId || '',
            });

            const APIResponse: ApiResponse = await response.json();

            if (APIResponse.status !== 'error') {
                const APIdata = APIResponse?.data;
                return <AllCourses standards={APIdata.standards} />;
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
}

export default DataAggregationPage;
