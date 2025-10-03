import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Session, getServerSession } from 'next-auth';
import { getResourcesAPI } from '@/app/api/resource';
import Resoures from '@/app/modules/resources/Resources';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { Resource } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'Resources',
    description: 'Your All Resources Here',
};

async function ResouresPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const { page = '1', orderBy = '', sortBy = '' } = searchParams;

    if (
        !(orderBy === 'name' || orderBy === 'createdAt' || orderBy === '') ||
        !(sortBy === 'asc' || sortBy === 'desc' || sortBy === '')
    ) {
        return redirect('resources');
    }
    const data: Session | null = await getServerSession(options);

    let APIdata: {
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
            const response = await getResourcesAPI({
                accessToken: data?.user?.accessToken,
                topic: '',
                type: '',
                page: parseInt(page, 10),
                limit: 10,
                orderBy,
                sortBy,
            });

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                APIdata = APIResponse?.data;
                return <Resoures APIdata={APIdata} />;
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

export default ResouresPage;
