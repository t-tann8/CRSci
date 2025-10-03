import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { getResourceAPI } from '@/app/api/resource';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { Resource, DEFAULT_RESOURCE, ResourceType, Video } from '@/lib/utils';
import FileViewing from '@/app/components/common/FileViewing';
import { getVideoAPI } from '@/app/api/video';
import VideoViewing from '@/app/components/common/VideoViewing';

async function ResourceDetailsPage({
    params,
}: {
    params: { typeName: string; contentId: string };
}) {
    const data: Session | null = await getServerSession(options);

    if (data) {
        try {
            let response = null;

            if (params.typeName === ResourceType.VIDEO) {
                response = await getVideoAPI({
                    accessToken: data?.user?.accessToken,
                    videoId: params.contentId,
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

            if (params.typeName === ResourceType.VIDEO) {
                const APIdata: { video: Video } = APIResponse?.data;
                const { videoUrl, thumbnailURL, topics, questions } =
                    APIdata.video;
                return (
                    <VideoViewing
                        videoURL={videoUrl}
                        thumbnailURL={thumbnailURL}
                        topics={topics}
                        questions={questions}
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
