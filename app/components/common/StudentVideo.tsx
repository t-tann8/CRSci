'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useRef, useState } from 'react';
import StandardIcon from '@/app/assets/icons/StandardIcon';
import VideoViewing from '@/app/components/common/VideoViewing';
import ClientSearchbar from '@/app/components/common/ClientSearchBar';
import PageLoader from './PageLoader';

export default function StudentVideo({
    standardId,
    headerText,
    videoURL,
    thumbnailURL,
    topics,
    questions,
    lastSeenTime,
}: {
    standardId: string;
    headerText: string;
    videoURL: string;
    thumbnailURL: string;
    topics: { [key: string]: string };
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
    lastSeenTime: string;
}) {
    const { back } = useRouter();
    const { data } = useSession();
    const studentLastPlayedTime = useRef<number>(0);
    return (
        <div>
            <ClientSearchbar
                headerText={headerText}
                tagline=""
                Icon={StandardIcon}
                isShowBackArrow
                onBackClick={back}
            />
            {data ? (
                <VideoViewing
                    standardId={standardId}
                    videoURL={videoURL}
                    thumbnailURL={thumbnailURL}
                    topics={topics}
                    questions={questions}
                    studentLastPlayedTime={studentLastPlayedTime}
                    lastSeenTime={lastSeenTime}
                    data={data}
                    hideButton
                />
            ) : (
                <PageLoader />
            )}
        </div>
    );
}
