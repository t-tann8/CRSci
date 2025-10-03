'use client';

/* eslint-disable import/no-extraneous-dependencies */
import { Session } from 'next-auth';
import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import {
    SaveOrRemoveVideoAPI,
    UpdateStudentVideoCompletedAPI,
    UpdateStudentVideoLastSeenTime,
    createVideoQuestionAnswerAPI,
} from '@/app/api/student';
import action from '@/app/action';
import { secondsToString, timeStringToSeconds } from '@/lib/utils';
import { Bookmark } from 'lucide-react';
import VideoQuestion from './VideoQuestion';
import DialogBox from './DialogBox';
import ButtonLoader from './ButtonLoader';

function getVideoIdFromPathname(path: string) {
    const parts = path.split('/');
    return parts[parts.length - 1];
}

type Question = {
    id: string;
    statement: string;
    options: { [key: string]: string };
    correctOption: string;
    correctOptionExplanation: string;
    popUpTime: string;
    totalMarks: number;
    attempt?: {
        id: string;
        answer: string;
        obtainedMarks: number;
    };
};

export default function VideoViewing({
    hideButton,
    standardId,
    videoURL,
    thumbnailURL,
    topics,
    questions,
    studentLastPlayedTime,
    lastSeenTime,
    data,
}: {
    hideButton?: boolean;
    standardId?: string;
    videoURL: string;
    thumbnailURL: string;
    topics: { [key: string]: string };
    questions: Question[];
    studentLastPlayedTime?: React.MutableRefObject<number>;
    lastSeenTime?: string;
    data?: Session;
}) {
    const pathname = usePathname();
    const isMountedRef = useRef(true);
    const playerRef = useRef<ReactPlayer>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState(
        questions.map((question) => question.attempt !== undefined)
    );
    const [playing, setPlaying] = useState(true);
    const videoId = getVideoIdFromPathname(pathname);
    const [videoReady, setVideoReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastPlayedTime, setLastPlayedTime] = useState<number>(
        lastSeenTime ? timeStringToSeconds(lastSeenTime) : 0
    );
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
        null
    );

    const topicsArray = Object.entries(topics).map(([popupTime, topic]) => ({
        popupTime,
        topic,
    }));
    const sortedTopics = topicsArray.sort((a, b) => {
        const popupTimeA = timeStringToSeconds(a.popupTime);
        const popupTimeB = timeStringToSeconds(b.popupTime);
        return popupTimeA - popupTimeB;
    });

    const questionsArray = questions.map((question) => ({
        popupTime: question.popUpTime,
        totalMarks: question.totalMarks,
    }));

    const handlePlayTopic = (popupTime: string) => {
        if (playerRef.current) {
            const sec = timeStringToSeconds(popupTime);
            playerRef.current.seekTo(sec);
        }
    };

    const handleVideoProgress = (progress: { playedSeconds: number }) => {
        const currentPlayedSeconds = progress.playedSeconds;
        const matchedQuestion = questions.find(
            (question) =>
                Math.abs(
                    currentPlayedSeconds -
                        timeStringToSeconds(question.popUpTime)
                ) < 1
        );

        if (studentLastPlayedTime) {
            studentLastPlayedTime.current = currentPlayedSeconds;
        }

        if (matchedQuestion) {
            setLastPlayedTime(currentPlayedSeconds + 2);
            setPlaying(false);
            setCurrentQuestion(matchedQuestion);
        }
    };

    const handlePlayAfterQuestion = () => {
        if (currentQuestion === null && lastPlayedTime !== null) {
            setPlaying(true);
            if (playerRef.current) {
                playerRef.current.seekTo(lastPlayedTime);
            }
        }
    };

    const markQuestionAsAnswered = () => {
        const index = questions.findIndex(
            (question) => question.id === currentQuestion?.id
        );
        if (index !== -1) {
            setAnsweredQuestions((prevState) => {
                const newState = [...prevState];
                newState[index] = true;
                return newState;
            });
        }
    };

    const handleConfirmLeavingQuestions = async () => {
        setIsDialogOpen(false);
        if (!data || !videoId || data?.user?.role !== 'student') {
            return;
        }
        answeredQuestions.forEach(async (isAnswered, i) => {
            if (!isAnswered) {
                try {
                    const question = questions[i];
                    const APIresponse = await createVideoQuestionAnswerAPI({
                        accessToken: data?.user?.accessToken,
                        userId: data?.user?.id,
                        questionId: question.id,
                        answer: '',
                        standardId: standardId || '',
                    });
                    if (APIresponse.status !== 200) {
                        throw new Error(
                            APIresponse?.data?.message ||
                                'An error occured while submitting your answer'
                        );
                    }
                    setAnsweredQuestions((prevState) => {
                        const newState = prevState.map(() => true); // Mark all as true (answered)
                        return newState;
                    });
                    // toast.success('Answer submitted successfully');
                } catch (error: any) {
                    // toast.error(
                    //     error?.response?.data?.message ||
                    //         'An error occured while submitting your answer'
                    // );
                }
            }
        });
        action('getStudentVideo');
        // action('getSavedVideos');
        try {
            const APIresponse = await UpdateStudentVideoCompletedAPI({
                accessToken: data?.user?.accessToken,
                studentId: data?.user?.id,
                videoId,
                lastSeenTime: secondsToString(
                    studentLastPlayedTime?.current ?? 0
                ),
                watchedCompletely: false,
                standardId: standardId || '',
            });

            if (APIresponse.status !== 200) {
                throw new Error('Error updating video last seen time');
            }

            action('getStudentStandardAPI');
            // action('getSavedVideos');
        } catch (error: any) {
            // toast.error(error.message || 'Error updating video last seen time');
        }
    };

    const handleCancelLeavingQuestions = () => {
        setIsDialogOpen(false);
    };

    const handleVideoEnd = async () => {
        if (!data || !videoId || data?.user?.role !== 'student') {
            return;
        }
        if (answeredQuestions.some((answered) => answered === false)) {
            setIsDialogOpen(true);
        } else {
            try {
                const APIresponse = await UpdateStudentVideoCompletedAPI({
                    accessToken: data?.user?.accessToken,
                    studentId: data?.user?.id,
                    videoId,
                    lastSeenTime: secondsToString(
                        studentLastPlayedTime?.current ?? 0
                    ),
                    watchedCompletely: true,
                    standardId: standardId || '',
                });

                if (APIresponse.status !== 200) {
                    throw new Error('Error updating video last seen time');
                }

                action('getStudentStandardAPI');
                // action('getSavedVideos');
            } catch (error: any) {
                // toast.error(error.message || 'Error updating video last seen time');
            }
        }
        // toast.success('Video last seen time updated successfully');
    };

    const handleSavingVideo = async () => {
        if (!data || data?.user?.role !== 'student') {
            return;
        }
        try {
            setIsLoading(true);
            const APIresponse = await SaveOrRemoveVideoAPI({
                accessToken: data?.user?.accessToken,
                standardId: standardId || '',
                studentId: data?.user?.id,
                videoId,
                save: true,
            });

            if (APIresponse.status !== 200) {
                throw new Error('Error updating video last seen time');
            }

            action('getSavedVideos');
            toast.success('Video saved successfully');
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    'Error updating video last seen time'
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentQuestion === null && lastPlayedTime !== null && videoReady) {
            setPlaying(true);
            if (playerRef.current) {
                playerRef.current.seekTo(lastPlayedTime);
            }
        }
    }, [videoReady, currentQuestion, lastPlayedTime]);

    useEffect(() => {
        const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
            try {
                if (!data || !videoId || data?.user?.role !== 'student') {
                    return;
                }
                const APIresponse = await UpdateStudentVideoLastSeenTime({
                    accessToken: data?.user?.accessToken,
                    studentId: data?.user?.id,
                    videoId,
                    lastSeenTime: secondsToString(
                        studentLastPlayedTime?.current ?? 0
                    ),
                    standardId: standardId || '',
                });

                if (APIresponse.status !== 200) {
                    throw new Error('Error updating video last seen time');
                }

                action('getStudentStandardAPI');
                // action('getSavedVideos');
                // toast.success('Video last seen time updated successfully');
            } catch (error: any) {
                // toast.error(
                //     error.message || 'Error updating video last seen time'
                // );
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            isMountedRef.current = false;
            if (!isMountedRef.current) {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const updateLastSeenTime = async () => {
            try {
                if (!data || !videoId || data?.user?.role !== 'student') {
                    return;
                }

                const APIresponse = await UpdateStudentVideoLastSeenTime({
                    accessToken: data?.user?.accessToken,
                    studentId: data?.user?.id,
                    videoId,
                    lastSeenTime: secondsToString(
                        studentLastPlayedTime?.current ?? 0
                    ),
                    standardId: standardId || '',
                });

                if (APIresponse.status !== 200) {
                    throw new Error('Error updating video last seen time');
                }

                action('getStudentStandardAPI');
                // action('getSavedVideos');
                // toast.success('Video last seen time updated successfully');
            } catch (error: any) {
                // toast.error(
                //     error.message || 'Error updating video last seen time'
                // );
            }
        };

        return () => {
            isMountedRef.current = false;
            if (!isMountedRef.current) {
                updateLastSeenTime();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div>
                {currentQuestion ? (
                    <div>
                        <VideoQuestion
                            question={currentQuestion}
                            setCurrentQuestion={setCurrentQuestion}
                            setPlaying={setPlaying}
                            handlePlayAfterQuestion={handlePlayAfterQuestion}
                            markQuestionAsAnswered={markQuestionAsAnswered}
                            hideButton={hideButton}
                            standardId={standardId || ''}
                        />
                    </div>
                ) : (
                    <div>
                        {/* {hideButton && (
                            <button
                                type="button"
                                disabled={isLoading}
                                className="bg-primary-color text-white w-38 p-3 xl:float-right xl:mb-0 mb-5 rounded-lg hover:bg-orange-400 flex items-center gap-2"
                                onClick={handleSavingVideo}
                            >
                                <Bookmark />
                                <span>
                                    {isLoading ? 'Loading...' : 'Save Video'}
                                </span>
                            </button>
                        )} */}

                        <div className="text-lg flex justify-center">
                            <ReactPlayer
                                ref={playerRef}
                                url={videoURL}
                                width="800px"
                                height="450px"
                                controls
                                playing={playing}
                                onProgress={handleVideoProgress}
                                className="mb-4"
                                onEnded={handleVideoEnd}
                                onReady={() => setVideoReady(true)}
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center gap-4">
                            {topicsArray.length > 0 ? (
                                <div className="mt-4 border-2 border-light-gray p-2 basis-1/2 grow">
                                    <h2 className="text-xl font-semibold mb-2 border-b py-2 text-center">
                                        Checkpoints
                                    </h2>
                                    <Table>
                                        <TableHeader className="font-semibold whitespace-nowrap">
                                            <TableRow>
                                                <TableCell>S.No</TableCell>
                                                <TableCell>Topic</TableCell>
                                                <TableCell>Time</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="whitespace-nowrap">
                                            {sortedTopics.map(
                                                (
                                                    { popupTime, topic },
                                                    index
                                                ) => (
                                                    <TableRow key={topic}>
                                                        <TableCell>
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            {topic}
                                                        </TableCell>
                                                        <TableCell>
                                                            {popupTime}
                                                        </TableCell>
                                                        <TableCell>
                                                            <button
                                                                type="button"
                                                                className="bg-primary-color text-white px-5 py-2 rounded-lg hover:bg-orange-400"
                                                                onClick={() =>
                                                                    handlePlayTopic(
                                                                        popupTime
                                                                    )
                                                                }
                                                            >
                                                                Play
                                                            </button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="mt-4 border-2 border-light-gray p-2 basis-1/2 grow text-center">
                                    <h2 className="text-xl font-semibold mb-2 border-b py-2 text-center">
                                        Checkpoints
                                    </h2>
                                    <p className="py-4 text-center">No Topic</p>
                                </div>
                            )}
                            {questionsArray.length > 0 ? (
                                <div className="mt-4 border-2 border-light-gray p-2 basis-1/2 grow">
                                    <h2 className="text-xl font-semibold mb-2 border-b py-2 text-center">
                                        Questions
                                    </h2>
                                    <Table>
                                        <TableHeader className="font-semibold whitespace-nowrap">
                                            <TableRow>
                                                <TableCell>Q.No</TableCell>
                                                <TableCell>
                                                    Total Marks
                                                </TableCell>
                                                <TableCell>Time</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="whitespace-nowrap">
                                            {questionsArray.map(
                                                (
                                                    { popupTime, totalMarks },
                                                    index
                                                ) => (
                                                    <TableRow key={popupTime}>
                                                        <TableCell>
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            {String(totalMarks)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {popupTime}
                                                        </TableCell>
                                                        <TableCell>
                                                            <button
                                                                type="button"
                                                                className="bg-primary-color text-white px-2 py-2 rounded-lg hover:bg-orange-400"
                                                                onClick={() =>
                                                                    handlePlayTopic(
                                                                        popupTime
                                                                    )
                                                                }
                                                            >
                                                                {answeredQuestions[
                                                                    index
                                                                ] === false
                                                                    ? 'Give Answer'
                                                                    : 'View Answer'}
                                                            </button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="mt-4 border-2 border-light-gray p-2 basis-1/2 grow text-center">
                                    <h2 className="text-xl font-semibold mb-2 border-b py-2 text-center">
                                        Questions
                                    </h2>
                                    <p className="py-4 text-center">
                                        No Question
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {isDialogOpen && (
                <DialogBox
                    isOpen={isDialogOpen}
                    message={`There ${
                        answeredQuestions.filter((answered) => !answered)
                            .length > 1
                            ? 'are'
                            : 'is'
                    } still ${
                        answeredQuestions.filter((answered) => !answered).length
                    } ${
                        answeredQuestions.filter((answered) => !answered)
                            .length > 1
                            ? 'questions'
                            : 'question'
                    } remaining to be answered. Are you sure you want submit them empty ?`}
                    onYes={handleConfirmLeavingQuestions}
                    onNo={handleCancelLeavingQuestions}
                />
            )}
        </>
    );
}
