import type { Metadata } from 'next';
import Dashboard from '@/app/modules/dashboard/Dashboard';
import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { User } from '@/app/modules/users/UsersTable';
import { getAllUsersProfileAPI } from '@/app/api/user';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { getResourcesAPI } from '@/app/api/resource';
import { Resource } from '@/lib/utils';
import { getAdminDashboardSummariesAPI } from '@/app/api/dashboard';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Here’s a Quick Overview',
};
async function DashboardPage() {
    const data: Session | null = await getServerSession(options);

    let UserAPIdata: {
        users: User[];
        totalUsers: number;
        totalPages: number;
    } = {
        users: [],
        totalUsers: 0,
        totalPages: 1,
    };

    let ResourceAPIData: {
        resources: Resource[];
        totalResources: number;
        totalPages: number;
    } = {
        resources: [],
        totalResources: 0,
        totalPages: 1,
    };

    if (data) {
        try {
            const adminDashboardResponse = await getAdminDashboardSummariesAPI({
                accessToken: data.user.accessToken,
            });
            const adminDashboardAPIResponse =
                await adminDashboardResponse.json();
            if (!adminDashboardResponse.ok) {
                throw new Error(adminDashboardAPIResponse?.message);
            }

            const userResponse = await getAllUsersProfileAPI(
                data?.user.accessToken
            );
            const UserAPIResponse = await userResponse.json();
            if (!userResponse.ok) {
                throw new Error(UserAPIResponse?.message);
            }

            const resourceResponse = await getResourcesAPI({
                accessToken: data?.user?.accessToken,
                topic: '',
                type: '',
                page: 1,
                limit: 10,
                orderBy: '',
                sortBy: '',
            });
            const ResourceAPIResponse = await resourceResponse.json();
            if (!resourceResponse.ok) {
                throw new Error(ResourceAPIResponse?.message);
            }

            if (
                adminDashboardAPIResponse.status !== 'error' &&
                UserAPIResponse.status !== 'error' &&
                ResourceAPIResponse.status !== 'error'
            ) {
                UserAPIdata = UserAPIResponse?.data;
                ResourceAPIData = ResourceAPIResponse?.data;
                return (
                    <Dashboard
                        name={data.user.name}
                        AdminSummaries={adminDashboardAPIResponse.data}
                        UserAPIData={UserAPIdata}
                        ResourceAPIData={ResourceAPIData}
                    />
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
}

export default DashboardPage;
