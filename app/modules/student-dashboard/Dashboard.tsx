'use client';

import React from 'react';
import { BookOpen, LibraryBig, BookOpenText } from 'lucide-react';
import Link from 'next/link';
import ClassroomIcon from '@/app/assets/icons/ClassroomIcon';
import StatsIcon from '@/app/assets/icons/StatsIcon';
import WavingHandIcon from '@/app/assets/icons/WavingHand';
import Searchbar from '@/app/components/common/Searchbar';
import Card from '@/app/modules/student-dashboard/Card';
import Learning from '@/app/modules/student-dashboard/Learning';
import VideoCard, { Card as Video } from '@/app/components/common/VideoCard';

type VideoData = {
    standardId: string;
    videoId: string;
    videoName: string;
    questionsCount: number;
    topicsCount: number;
    lastSeenTime: string;
    duration: string;
    thumbnailURL: string;
    completed: boolean;
};

type StandardData = {
    standardId: string;
    standardName: string;
    videoResourcesCount: number;
    nonVideoResourcesCount: number;
};

export type DashboardData = {
    studentName: string;
    standardsCount: number;
    classroomName: string;
    standardsData: StandardData[];
    videosData: VideoData[];
    averageObtainedWeightage: number;
    averageTotalWeightage: number;
    assignmentsLeft?: number;
    assignmentsSolved?: number;
};

function Dashboard({ APIdata }: { APIdata: DashboardData }) {
    return (
        <div className="pb-4">
            <Searchbar
                headerText={`Hello ${APIdata.studentName}!`}
                tagline="Here’s a Quick Overview"
                Icon={WavingHandIcon}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 my-5">
                <Card
                    Icon={LibraryBig}
                    header="Standards"
                    description={APIdata.standardsCount}
                    iconBg="bg-yellow-50"
                    border="border-2 border-yellow-300"
                    iconColor="#F1E333"
                />
                <Card
                    Icon={StatsIcon}
                    header="Overall Performance"
                    description={`${APIdata.averageObtainedWeightage} of ${APIdata.averageTotalWeightage} %`}
                    iconBg="bg-orange-100"
                    border="border-2 border-orange-400"
                    iconColor="#F59A3B"
                />
                <Card
                    Icon={ClassroomIcon}
                    header="Classroom"
                    description={
                        APIdata.classroomName === ''
                            ? 'N/A'
                            : APIdata.classroomName
                    }
                    iconBg="bg-green-100"
                    border="border-2 border-green-600"
                    iconColor="#7AA43E"
                />
                <Card
                    Icon={BookOpenText}
                    header="Attempted Assesments"
                    description={APIdata.assignmentsSolved || 0}
                    iconBg="bg-purple-100"
                    border="border-2 border-purple-300"
                    iconColor="#7D0DC3"
                />
                <Card
                    Icon={BookOpen}
                    header="Assigned Assesments"
                    description={APIdata.assignmentsLeft || 0}
                    iconBg="bg-red-100"
                    border="border-2 border-red-300"
                    iconColor="#F02070"
                />
            </div>

            <div className="flex mobile:flex-col md:justify-between md:items-center items-start mt-8 w-full">
                <p className="font-semibold text-xl w-fit ">
                    Your Assigned Learnings
                </p>
                <div className="mobile:flex mobile:justify-end mobile:mt-2">
                    <p className="border cursor-pointer py-2 px-4 text-center rounded-lg h-fit w-fit font-semibold text-dark-gray hover:bg-primary-color hover:text-white">
                        <Link href="/student/learning">Show All</Link>
                    </p>
                </div>
            </div>

            <div className="my-3">
                <Learning standards={APIdata.standardsData} />
            </div>

            {/* <div className="flex mobile:flex-col md:items-center items-start md:justify-between mt-8">
                <p className="font-semibold text-xl ">Saved Videos</p>
                <div className="mobile:flex mobile:justify-end">
                    <p className=" border cursor-pointer py-2  px-4 text-center rounded-lg h-fit w-fit font-semibold text-dark-gray  hover:bg-primary-color hover:text-white">
                        <Link href="/student/saved-videos">Show All</Link>
                    </p>
                </div>
            </div>

            <div className="mt-3">
                {APIdata?.videosData?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full h-72  bg-white rounded-lg shadow-lg">
                        <ShieldAlert size={48} />
                        <p className="text-lg font-semibold mt-4">
                            No Videos Found
                        </p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-col-1 gap-4 md:gap-6 ">
                        {APIdata?.videosData?.map((video) => (
                            <VideoCard
                                card={{
                                    id: video.videoId,
                                    imageUrl: video.thumbnailURL,
                                    Text: video.videoName,
                                    Questions: video.questionsCount,
                                    Checkpoints: video.topicsCount,
                                    lastSeenTime: video.lastSeenTime,
                                    duration: video.duration,
                                    completed: video.completed,
                                    standardId: video.standardId,
                                }}
                                key={video.videoId}
                            />
                        ))}
                    </div>
                )}
            </div> */}
        </div>
    );
}

export default Dashboard;
