import React from 'react';
import Users from '@/app/modules/users/Users';
import { Session, getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { User } from '@/app/modules/users/UsersTable';
import { getAllUsersProfileAPI } from '@/app/api/user';
import { redirect } from 'next/navigation';
import UnhandledError from '@/app/modules/error/UnhandledError';

async function UsersPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const { page = '1', orderBy = '', sortBy = '' } = searchParams;

    if (
        !(orderBy === 'name' || orderBy === 'createdAt' || orderBy === '') ||
        !(sortBy === 'asc' || sortBy === 'desc' || sortBy === '')
    ) {
        return redirect('users');
    }
    const data: Session | null = await getServerSession(options);

    let APIdata: { users: User[]; totalUsers: number; totalPages: number } = {
        users: [],
        totalUsers: 0,
        totalPages: 1,
    };

    if (data) {
        try {
            const response = await getAllUsersProfileAPI(
                data?.user.accessToken,
                parseInt(page, 10),
                10,
                orderBy,
                sortBy
            );

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                APIdata = APIResponse?.data;
                return <Users APIdata={APIdata} />;
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

    return <Users APIdata={APIdata} />;
}

export default UsersPage;
