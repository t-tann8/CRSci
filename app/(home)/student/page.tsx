import React from 'react';
import { Metadata } from 'next';
import { Session, getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Dashboard, {
    DashboardData,
} from '@/app/modules/student-dashboard/Dashboard';
import { getStudentDashboardSummariesAPI } from '@/app/api/dashboard';
import UnhandledError from '@/app/modules/error/UnhandledError';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Here’s a Quick Overview',
};

type ApiResponse = {
    status: string;
    data?: DashboardData;
    message?: string;
};

async function DashboardPage() {
    const data: Session | null = await getServerSession(options);

    if (data) {
        try {
            const studentDashboardResponse =
                await getStudentDashboardSummariesAPI({
                    accessToken: data?.user?.accessToken,
                    studentId: data?.user?.id,
                });
            const studentDashboardAPIResponse: ApiResponse =
                await studentDashboardResponse.json();
            if (!studentDashboardResponse.ok) {
                throw new Error(studentDashboardAPIResponse?.message);
            }
            return <Dashboard APIdata={studentDashboardAPIResponse.data!} />;
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

export default DashboardPage;
