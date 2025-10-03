import React from 'react';
import { CalendarDays, ShieldAlert } from 'lucide-react';
import Searchbar from '@/app/components/common/Searchbar';
import VideoCard from '@/app/components/common/VideoCard';

type Video = {
    videoId: string;
    name: string;
    lastSeenTime: string;
    thumbnailURL: string;
    duration: string;
    questionCount: number;
    topicCount: number;
    accessDate: string;
    completed: boolean;
    standardId: string;
};

type VideoData = {
    date: string;
    videos: Video[];
};

function SavedVideos({
    SavedVideosByDays,
}: {
    SavedVideosByDays: VideoData[];
}) {
    return (
        <section>
            <Searchbar
                headerText="My Saved Videos"
                tagline="Your All Saved Videos"
            />
            <div className="flex justify-between items-center mt-8">
                <p className="text-xl font-light">Saved Video’s</p>
            </div>
            {SavedVideosByDays?.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-96 mt-5 bg-white rounded-lg shadow-lg">
                    <ShieldAlert size={48} />
                    <p className="text-lg font-semibold mt-4">
                        No Videos Found
                    </p>
                </div>
            ) : (
                SavedVideosByDays.map((day) => (
                    <div className="mt-8" key={day.date}>
                        <div className="flex space-x-2 items-center mb-4">
                            <CalendarDays color="orange" size={20} />
                            <p className="font-semibold text-lg">
                                Date {day.date}
                            </p>
                        </div>
                        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-col-1 gap-4 md:gap-6">
                            {day.videos.map((savedVideo) => (
                                <VideoCard
                                    card={{
                                        id: savedVideo.videoId,
                                        imageUrl: savedVideo.thumbnailURL,
                                        Text: savedVideo.name,
                                        Questions: savedVideo.questionCount,
                                        Checkpoints: savedVideo.topicCount,
                                        Resources: 8,
                                        lastSeenTime: savedVideo.lastSeenTime,
                                        duration: savedVideo.duration,
                                        completed: savedVideo.completed,
                                        standardId: savedVideo.standardId,
                                    }}
                                    key={savedVideo.videoId}
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </section>
    );
}

export default SavedVideos;
