import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { getResourceAPI } from '@/app/api/resource';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { Resource, ResourceType } from '@/lib/utils';
import FileViewing from '@/app/components/common/FileViewing';
import { getStudentVideoAPI } from '@/app/api/student';
import StudentVideo from '@/app/components/common/StudentVideo';

export interface Video {
    id: string;
    resourceId: string;
    thumbnailURL: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    videoUrl: string;
    questions: {
        id: string;
        statement: string;
        options: { [key: string]: string };
        correctOption: string;
        correctOptionExplanation: string;
        totalMarks: number;
        popUpTime: string;
        attempt: {
            id: string;
            answer: string;
            obtainedMarks: number;
        };
    }[];
    topics: { [key: string]: string };
    lastSeenTime?: string;
}

async function ResourceDetailsPage({
    params,
}: {
    params: { id: string; resourceType: string; contentId: string };
}) {
    const data: Session | null = await getServerSession(options);

    if (data) {
        try {
            let response = null;

            if (params.resourceType === ResourceType.VIDEO) {
                response = await getStudentVideoAPI({
                    accessToken: data?.user?.accessToken,
                    studentId: data?.user?.id,
                    videoId: params.contentId,
                    standardId: params.id,
                });
            } else {
                response = await getResourceAPI({
                    accessToken: data?.user?.accessToken,
                    resourceId: params.contentId,
                });
            }
            const APIResponse = await response.json();
            if (!response.ok || APIResponse.status === 'error') {
                throw new Error(APIResponse?.message);
            }

            if (params.resourceType === ResourceType.VIDEO) {
                const APIdata: { video: Video } = APIResponse?.data;
                const {
                    name,
                    videoUrl,
                    thumbnailURL,
                    topics,
                    questions,
                    lastSeenTime,
                } = APIdata.video;
                return (
                    <StudentVideo
                        headerText={name}
                        videoURL={videoUrl}
                        thumbnailURL={thumbnailURL}
                        topics={topics}
                        questions={questions}
                        lastSeenTime={lastSeenTime ?? '00:00:00'}
                        standardId={params.id}
                    />
                );
            }
            const APIdata: Resource = APIResponse?.data;
            return (
                <FileViewing
                    resourceURL={APIdata.url ?? ''}
                    type={APIdata.type}
                />
            );
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
