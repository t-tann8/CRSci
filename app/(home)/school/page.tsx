import React from 'react';
import { Metadata } from 'next';
import SchoolDashboard from '@/app/modules/school-dashboard/Dashboard';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getSchoolDashboardAPI } from '@/app/api/school';
import UnhandledError from '@/app/modules/error/UnhandledError';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Here’s a Quick Overview',
};

async function DashboardPage() {
    const session = await getServerSession(options);

    try {
        if (session) {
            const result = await getSchoolDashboardAPI(
                session?.user.accessToken || '',
                session?.user.schoolId || '',
                session?.user?.id || ''
            );
            // eslint-disable-next-line eqeqeq
            if (result?.statusCode != '200') {
                throw new Error(result?.message);
            }
            return (
                <SchoolDashboard name={session?.user.name} data={result.data} />
            );
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

export default DashboardPage;
