import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { ResourceType } from '@/lib/utils';
import { getStandardTopicsAPI } from '@/app/api/standard';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import StandardDetails from '@/app/modules/standard/details/StandardDetails';
import Topics from '@/app/modules/standard/Topic';

interface TopicResourceCount {
    topicName: string;
    videoCount: number;
    nonVideoCount: number;
}

interface APIData {
    name: string;
    description: string;
    totalTopics: number;
    topicResourceCounts: TopicResourceCount[];
}

const DEFAULT_STANDARD = {
    name: '',
    description: '',
    totalTopics: 0,
    topicResourceCounts: [],
};
async function DetailsPage({ params }: { params: { id: string } }) {
    const data: Session | null = await getServerSession(options);

    let APIdata: APIData = DEFAULT_STANDARD;

    if (data) {
        try {
            const response = await getStandardTopicsAPI({
                accessToken: data?.user?.accessToken,
                standardId: params.id,
            });

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                APIdata = APIResponse?.data;
                const { name, description, totalTopics, topicResourceCounts } =
                    APIdata;
                return (
                    <Topics
                        isShownFromTeacher={false}
                        standardId={params.id}
                        standardName={name}
                        standardDescription={description}
                        topicsCount={totalTopics}
                        allTopics={topicResourceCounts}
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
