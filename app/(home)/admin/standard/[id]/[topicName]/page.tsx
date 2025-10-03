import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { ResourceType } from '@/lib/utils';
import { getTopicResourcesAPI } from '@/app/api/standard';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import StandardDetails from '@/app/modules/standard/details/StandardDetails';

interface Topic {
    name: string;
    resourceId: string;
    type: ResourceType;
    topic: string;
    videoId?: string;
}
interface DailyUpload {
    day: number;
    dayName: string;
    topics: Topic[];
}
interface APIData {
    name: string;
    description: string;
    dailyUploads: DailyUpload[];
}

const DEFAULT_STANDARD = {
    name: '',
    description: '',
    dailyUploads: [
        {
            day: 0,
            dayName: '',
            topics: [
                {
                    name: '',
                    resourceId: '',
                    type: ResourceType.VIDEO,
                    topic: '',
                },
            ],
        },
    ],
};
async function DetailsPage({
    params,
}: {
    params: { id: string; topicName: string };
}) {
    const data: Session | null = await getServerSession(options);

    let APIdata: APIData = DEFAULT_STANDARD;

    const { id, topicName } = params;

    if (data) {
        try {
            const response = await getTopicResourcesAPI({
                accessToken: data?.user?.accessToken,
                standardId: id,
                topicName,
            });

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                APIdata = APIResponse?.data;
                const { name, description, dailyUploads } = APIdata;
                return (
                    <StandardDetails
                        params={params}
                        name={name}
                        description={description}
                        dailyUploads={dailyUploads}
                        isShownFromAdmin
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

export default DetailsPage;
