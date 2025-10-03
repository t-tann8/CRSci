'use client';

import React, { useState } from 'react';
import { Poppins } from 'next/font/google';
import {
    Eye,
    LucideFileQuestion,
    PlayIcon,
    Trash,
    Download,
} from 'lucide-react';
import {
    Resource,
    ResourceType,
    ResourceToPath,
    handleDownload,
    capitalizeWords,
    DEFAULT_RESOURCE,
    convertSpacesToDashes,
} from '@/lib/utils';
import {
    Table,
    TableRow,
    TableBody,
    TableCell,
} from '@/app/components/ui/table';
import EditIcon from '@/app/assets/icons/EditIcon';
import { usePathname, useRouter } from 'next/navigation';
import EditTopicsModal from '../video/EditTopicsModal';
import EditQuestionsModal from '../video/EditQuestionsModal';
import UpdateResourceModal from '../resources/UpdateResourceModal';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});

interface Topic {
    name: string;
    resourceId: string;
    type: ResourceType;
    topic: string;
    videoId?: string;
    watched?: boolean;
    completed?: boolean;
    canWrite?: boolean;
    deadline?: number;
    totalMarks?: number;
    URL?: string;
}

function StandardTable({
    topicList,
    released,
    isShownFromAdmin,
    isShownFromTeacher,
    isShownFromStudent,
}: {
    topicList: Topic[];
    released?: boolean;
    isShownFromAdmin?: boolean;
    isShownFromTeacher?: boolean;
    isShownFromStudent?: boolean;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [step, setStep] = useState(0);
    const [editResourceId, setEditResourceId] = useState('');
    const [isShowEditVideoModal, setIsShowEditVideoModal] = useState(false);
    const [showUpdateResourceModal, setShowUpdateResourceModal] =
        useState(false);
    const [selectedResource, setSelectedResource] =
        useState<Resource>(DEFAULT_RESOURCE);

    const handleOpenEditVideoModal = (id: string) => {
        setEditResourceId(id);
        setIsShowEditVideoModal(true);
    };

    const handleCloseEditVideoModal = () => {
        setEditResourceId('');
        setIsShowEditVideoModal(false);
        setStep(0);
    };

    const handleOpenEditResourceModal = (
        id: string,
        name: string,
        type: ResourceType,
        topic: string,
        deadline?: number,
        totalMarks?: number
    ) => {
        setShowUpdateResourceModal(true);
        setSelectedResource({ id, name, type, topic, deadline, totalMarks });
    };

    const handleCloseEditResourceModal = () => {
        setShowUpdateResourceModal(false);
        setSelectedResource(DEFAULT_RESOURCE);
    };

    const viewResource = (
        type: ResourceType,
        contentId: string,
        topic: string
    ) => {
        if (isShownFromAdmin) {
            if (type === ResourceType.VIDEO) {
                return router.push(`/admin/video/${contentId}`);
            }
            return router.push(
                `/admin/resources/${convertSpacesToDashes(topic)}/${
                    ResourceToPath[type]
                }/${contentId}`
            );
        }

        if (isShownFromTeacher) {
            return router.push(`${pathname}/${type}/${contentId}`);
        }

        return router.push(`${pathname}/${type}/${contentId}`);
    };

    const takeAssessment = (assessmentId: string) =>
        router.push(`${pathname}/assessment/${assessmentId}`);

    return (
        <>
            <Table
                className={`text-sm mobile:text-xs ${poppins.className} lg:table-fixed`}
            >
                <TableBody className="whitespace-nowrap w-full">
                    {topicList.map((topic, index) => (
                        <TableRow key={topic.resourceId}>
                            <TableCell className="font-medium w-[20%]">
                                <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                    {index + 1}
                                </span>
                            </TableCell>
                            <TableCell className="flex gap-2 items-center p-8">
                                {topic.name}
                            </TableCell>
                            <TableCell className="text-dark-gray">
                                {capitalizeWords(topic.type)}
                            </TableCell>
                            <TableCell className="flex justify-center items-center">
                                {!isShownFromStudent && (
                                    <div className="mr-2 bg-light-orange rounded-md p-1 cursor-pointer">
                                        <Eye
                                            color="#F59A3B"
                                            width={18}
                                            height={18}
                                            onClick={() =>
                                                topic.type !==
                                                ResourceType.VIDEO
                                                    ? viewResource(
                                                          topic.type,
                                                          topic.resourceId,
                                                          topic.topic
                                                      )
                                                    : viewResource(
                                                          topic.type,
                                                          topic.videoId ?? '',
                                                          topic.name
                                                      )
                                            }
                                        />
                                    </div>
                                )}
                                {isShownFromStudent && (
                                    <div
                                        className={`flex space-x-2 items-center border w-fit py-2 px-4 rounded-xl cursor-pointer ${
                                            !released
                                                ? 'bg-gray-300 text-white'
                                                : topic.completed
                                                  ? 'bg-white text-black border-green-500'
                                                  : 'bg-primary-color text-white'
                                        }`}
                                        onClick={() => {
                                            if (!released) {
                                                return null;
                                            }
                                            if (
                                                topic.type ===
                                                ResourceType.VIDEO
                                            ) {
                                                return viewResource(
                                                    topic.type,
                                                    topic.videoId ?? '',
                                                    topic.name
                                                );
                                            }
                                            if (
                                                topic.type ===
                                                    ResourceType.WORKSHEET ||
                                                topic.type ===
                                                    ResourceType.ASSIGNMENT ||
                                                topic.type ===
                                                    ResourceType.FORMATIVE_ASSESSMENT ||
                                                topic.type ===
                                                    ResourceType.SUMMARIZE_ASSESSMENT ||
                                                topic.type === ResourceType.QUIZ
                                            ) {
                                                return takeAssessment(
                                                    topic.resourceId
                                                );
                                            }
                                            return viewResource(
                                                topic.type,
                                                topic.resourceId,
                                                topic.topic
                                            );
                                        }}
                                    >
                                        {topic.type === ResourceType.VIDEO ? (
                                            <>
                                                <PlayIcon
                                                    stroke={
                                                        topic.watched &&
                                                        topic.completed
                                                            ? `black`
                                                            : `white`
                                                    }
                                                />
                                                <p>
                                                    {!topic.watched
                                                        ? 'Play'
                                                        : topic.completed
                                                          ? 'Play'
                                                          : 'Continue'}
                                                </p>
                                            </>
                                        ) : topic.type === ResourceType.QUIZ ||
                                          topic.type ===
                                              ResourceType.ASSIGNMENT ||
                                          topic.type ===
                                              ResourceType.FORMATIVE_ASSESSMENT ||
                                          topic.type ===
                                              ResourceType.SUMMARIZE_ASSESSMENT ||
                                          topic.type ===
                                              ResourceType.WORKSHEET ? (
                                            <p className="py-0.5 px-2.5">
                                                {topic.canWrite
                                                    ? 'Start'
                                                    : 'View'}
                                            </p>
                                        ) : (
                                            <p className="py-0.5 px-2.5">
                                                Open
                                            </p>
                                        )}
                                    </div>
                                )}
                                {isShownFromAdmin && (
                                    <div className="mr-2 rounded-md cursor-pointer">
                                        <EditIcon
                                            width={28}
                                            height={28}
                                            onClick={() => {
                                                if (topic.type === 'video') {
                                                    handleOpenEditVideoModal(
                                                        topic.videoId ?? ''
                                                    );
                                                } else {
                                                    handleOpenEditResourceModal(
                                                        topic.resourceId,
                                                        topic.name,
                                                        topic.type,
                                                        topic.topic,
                                                        topic.deadline,
                                                        topic.totalMarks
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                                {isShownFromTeacher && (
                                    <div className="mr-2 bg-green-100 rounded-md p-1 cursor-pointer">
                                        <Download
                                            color="#228B22"
                                            width={18}
                                            height={18}
                                            onClick={() =>
                                                handleDownload({
                                                    name: topic.name,
                                                    url: topic.URL || '',
                                                })
                                            }
                                        />
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {isShowEditVideoModal && step === 0 && (
                <div className="fixed right-0 top-0 z-50 w-full md:w-[60%] lg:w-[30%]">
                    <EditQuestionsModal
                        videoId={editResourceId}
                        onClose={handleCloseEditVideoModal}
                        onButtonClick={() => setStep((prev) => prev + 1)}
                    />
                </div>
            )}

            {isShowEditVideoModal && step === 1 && (
                <div className="fixed right-0 top-0 z-50 w-full md:w-[60%] lg:w-[30%]">
                    <EditTopicsModal
                        videoId={editResourceId}
                        onClose={handleCloseEditVideoModal}
                        onButtonClick={() => setStep((prev) => prev + 1)}
                    />
                </div>
            )}

            {showUpdateResourceModal && (
                <div className="fixed right-0 top-0 z-50 w-[100%] md:w-[60%] lg:w-[30%]">
                    <UpdateResourceModal
                        onClose={handleCloseEditResourceModal}
                        resource={selectedResource}
                    />
                </div>
            )}
        </>
    );
}

export default StandardTable;
