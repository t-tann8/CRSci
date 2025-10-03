import React from 'react';
import { redirect } from 'next/navigation';
import { Session, getServerSession } from 'next-auth';
import { getResourcesAPI } from '@/app/api/resource';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import ResourceDetails from '@/app/modules/resources/topicType/details/ResouceDetails';
import {
    Resource,
    convertDashesToSpacesSimple,
    PathToResource,
} from '@/lib/utils';

async function ResourceDetailsPage({
    params,
    searchParams,
}: {
    params: { topic: string; typeName: string };
    searchParams: { [key: string]: string | undefined };
}) {
    const type = PathToResource[params.typeName as keyof typeof PathToResource];

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
                topic: convertDashesToSpacesSimple(params.topic),
                type,
                page: parseInt(page, 10),
                limit: 10,
                orderBy,
                sortBy,
            });

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                APIdata = APIResponse?.data;
                return <ResourceDetails params={params} APIdata={APIdata} />;
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

export default ResourceDetailsPage;
