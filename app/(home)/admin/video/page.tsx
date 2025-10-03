import React from 'react';
import { redirect } from 'next/navigation';
import { Session, getServerSession } from 'next-auth';
import { VideoSummary } from '@/lib/utils';
import Video from '@/app/modules/video/Video';
import { getVideosAPI } from '@/app/api/video';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { options } from '@/app/api/auth/[...nextauth]/options';

const getAllVideos = async (
    data: Session,
    page: string,
    orderBy: string,
    sortBy: string
) => {
    const response = await getVideosAPI({
        accessToken: data?.user?.accessToken,
        topic: '',
        type: '',
        page: parseInt(page, 10),
        limit: 10,
        orderBy,
        sortBy,
    });
    const APIResponse = await response.json();
    return APIResponse;
};

async function VideoPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const { page = '1', orderBy = '', sortBy = '' } = searchParams;

    if (
        !(orderBy === 'name' || orderBy === 'createdAt' || orderBy === '') ||
        !(sortBy === 'asc' || sortBy === 'desc' || sortBy === '')
    ) {
        return redirect('video');
    }

    const data: Session | null = await getServerSession(options);

    if (!data) {
        redirect('/signin');
    }

    const APIResponse = await getAllVideos(data, page, orderBy, sortBy);

    return <Video APIdata={APIResponse?.data} />;
}

export default VideoPage;
