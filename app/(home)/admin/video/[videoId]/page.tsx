import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { DEFAULT_VIDEO, Video } from '@/lib/utils';
import { getVideoAPI } from '@/app/api/video';
import VideoViewing from '@/app/components/common/VideoViewing';

async function VideoDetailsPage({ params }: { params: { videoId: string } }) {
    const data: Session | null = await getServerSession(options);

    let APIdata: { video: Video } = {
        video: {
            ...DEFAULT_VIDEO,
        },
    };

    if (data) {
        try {
            const response = await getVideoAPI({
                accessToken: data?.user?.accessToken,
                videoId: params.videoId,
            });

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                APIdata = APIResponse?.data;
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

export default VideoDetailsPage;
