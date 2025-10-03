import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { getResourceAPI } from '@/app/api/resource';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { Resource, DEFAULT_RESOURCE } from '@/lib/utils';
import FileViewing from '@/app/components/common/FileViewing';

async function ResourceDetailsPage({
    params,
}: {
    params: { resourceId: string };
}) {
    const data: Session | null = await getServerSession(options);

    let APIdata: Resource = {
        ...DEFAULT_RESOURCE,
    };

    if (data) {
        try {
            const response = await getResourceAPI({
                accessToken: data?.user?.accessToken,
                resourceId: params.resourceId,
            });

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                APIdata = APIResponse?.data;
                return (
                    <FileViewing
                        resourceURL={APIdata.url ?? ''}
                        type={APIdata.type}
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
}

export default ResourceDetailsPage;
