import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { ResourceType } from '@/lib/utils';
import { getStudentStandardAPI } from '@/app/api/student';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import StandardDetails from '@/app/modules/standard/details/StandardDetails';

interface Topic {
    name: string;
    resourceId: string;
    type: ResourceType;
    topic: string;
    videoId?: string;
    watched?: boolean;
    completed?: boolean;
    canWrite?: boolean;
}
interface DailyUpload {
    day: number;
    date: string;
    dayName: string;
    released: boolean;
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
            date: '',
            dayName: '',
            released: false,
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
async function StandardDetailsPage({ params }: { params: { id: string } }) {
    const data: Session | null = await getServerSession(options);

    let APIdata: APIData = DEFAULT_STANDARD;

    if (data) {
        try {
            const response = await getStudentStandardAPI({
                accessToken: data?.user?.accessToken,
                standardId: params.id,
                studentId: data?.user?.id,
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
                        isShownFromStudent
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

export default StandardDetailsPage;
