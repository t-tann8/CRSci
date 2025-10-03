import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Session, getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import Resources from '@/app/modules/student-resources/Resources';
import { getStandardsResourcesAndCountAPI } from '@/app/api/student';

export const metadata: Metadata = {
    title: 'All Assignments',
    description: 'Your All Assignments Allocated to Topics',
};

type Resource = {
    id: string;
    name: string;
    type: string;
    topic: string;
    url: string;
    released: boolean;
};

type Standard = {
    id: string;
    name: string;
    resourceCount: number;
    resources: Resource[];
};

type APIData = {
    totalPages: number;
    standards: Standard[];
};

const defaultAPIData: APIData = {
    totalPages: 0,
    standards: [
        {
            id: '',
            name: '',
            resourceCount: 0,
            resources: [
                {
                    id: '',
                    name: '',
                    type: '',
                    topic: '',
                    url: '',
                    released: false,
                },
            ],
        },
    ],
};

async function ResourcesPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const { page = '1' } = searchParams;

    if (!(parseInt(page, 10) >= 1)) {
        return redirect('resources');
    }

    const data: Session | null = await getServerSession(options);
    if (data) {
        try {
            const response = await getStandardsResourcesAndCountAPI({
                accessToken: data?.user.accessToken,
                studentId: data?.user?.id,
                page,
                limit: '10',
            });

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                const APIdata: APIData = APIResponse?.data;
                return <Resources APIdata={APIdata} />;
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

    return <Resources APIdata={defaultAPIData} />;
}

export default ResourcesPage;
