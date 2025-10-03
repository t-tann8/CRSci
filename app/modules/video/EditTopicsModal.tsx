import { toast } from 'react-toastify';
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import {
    addTopicsInVideoAPI,
    getVideoAPI,
    updateVideoAPI,
} from '@/app/api/video';
import ModalFooter from '@/app/components/common/ModalFooter';
import { Label } from '@/app/components/ui/label';
import Input from '@/app/components/common/Input';
import { timeStringToSeconds, validationError } from '@/lib/utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ErrorMessage } from '@hookform/error-message';
import { FileVideoIcon, X } from 'lucide-react';
import action from '@/app/action';
import PageLoader from '@/app/components/common/PageLoader';
import ButtonLoader from '@/app/components/common/ButtonLoader';
import { ModalHeader } from '../../components/common/ModalHeader';

const questionsTypes = [
    { label: 'open', value: 'open' },
    { label: 'mcq', value: 'mcq' },
];

const answerOptions = [
    { label: 'option1', value: 'option1' },
    { label: 'option2', value: 'option2' },
    { label: 'option3', value: 'option3' },
    { label: 'option4', value: 'option4' },
];

interface Option {
    [key: string]: string;
}

interface Question {
    id: string;
    videoId: string;
    statement: string;
    options: Option;
    correctOption: string;
    correctOptionExplanation: string;
    totalMarks: number;
    popUpTime: string;
    type: 'mcq' | 'open';
}

interface Topic {
    timeline: string;
    name: string;
}

interface Video {
    id: string;
    resourceId: string;
    thumbnailURL: string;
    name: string;
    videoUrl: string;
    questions: Question[];
    topics: Topic[];
    duration: string;
}

interface FormValues {
    video: Video;
}

function EditTopicsModal({
    newVideo,
    newVideoDuration,
    videoId,
    onClose,
    onButtonClick,
}: {
    newVideo?: boolean;
    newVideoDuration?: string;
    videoId: string;
    onClose: () => void;
    onButtonClick: () => void;
}) {
    const { data } = useSession();
    const topicAddedRef = useRef(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [originalVideoData, setOriginalVideoData] = useState<Video>(
        {} as Video
    );
    const methods = useForm<FormValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = methods;

    const {
        fields: topicFields,
        append: appendTopic,
        remove: removeTopic,
    } = useFieldArray<FormValues>({
        control,
        name: 'video.topics',
    });

    const onSubmit = async (formdata: FormValues) => {
        if (!data) {
            return;
        }

        const transformedTopics = formdata.video.topics.reduce(
            (obj, topic) => {
                obj[topic.timeline] = topic.name;
                return obj;
            },
            {} as { [key: string]: string }
        );

        try {
            let response = null;
            setButtonLoading(true);
            if (newVideo) {
                response = await addTopicsInVideoAPI({
                    videoId,
                    topics: transformedTopics,
                    accessToken: data?.user?.accessToken || '',
                });
            } else {
                const { name, thumbnailURL, questions } = originalVideoData;
                response = await updateVideoAPI({
                    accessToken: data?.user?.accessToken,
                    videoId,
                    name,
                    thumbnailURL,
                    questions,
                    topics: transformedTopics,
                });
            }
            if (response.status !== 200) {
                toast.error(
                    response?.data?.message ||
                        `An error occurred while ${
                            newVideo ? `adding` : `updating`
                        } video topics`
                );
            }
            await action('getVideos');
            toast.success(
                `Video topics ${newVideo ? `added` : `updated`} successfully`
            );
            onClose();
        } catch (error: any) {
            toast.error(
                error?.message ||
                    'An error occurred while updating video topics'
            );
        } finally {
            setButtonLoading(false);
        }
    };

    useEffect(() => {
        // Only proceed if data is available
        if (!data) {
            return;
        }

        if (newVideo) {
            if (topicFields.length === 0 && !topicAddedRef.current) {
                appendTopic({
                    timeline: '',
                    name: '',
                });
                topicAddedRef.current = true;
            }
        } else {
            const getVideoData = async () => {
                setModalLoading(true);
                try {
                    const APIData = await getVideoAPI({
                        accessToken: data?.user?.accessToken,
                        videoId,
                    });

                    if (!APIData.ok) {
                        const errorData = await APIData.json();
                        throw new Error(
                            errorData?.message ??
                                'An error occurred while fetching video data'
                        );
                    }

                    const responseData = await APIData.json();
                    const videoData = responseData?.data?.video;
                    setOriginalVideoData(videoData);
                    if (videoData && videoData.topics) {
                        const initialTopics: {
                            timeline: string;
                            name: string;
                        }[] = Object.entries(videoData.topics).map(
                            ([timeline, name]) => ({
                                timeline,
                                name: name as string,
                            })
                        );
                        reset({ video: { topics: initialTopics } });

                        if (initialTopics?.length === 0) {
                            appendTopic({
                                timeline: '',
                                name: '',
                            });
                        }
                    }
                } catch (error: any) {
                    toast.error(
                        error.message ??
                            'An error occurred while fetching video data'
                    );
                } finally {
                    setModalLoading(false);
                }
            };

            getVideoData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <section className="w-full bg-white h-screen py-4 shadow-lg">
            {modalLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="h-[90%] overflow-y-scroll w-full px-6"
                    >
                        <div>
                            <ModalHeader
                                headerText={{
                                    heading: newVideo
                                        ? 'Upload Video'
                                        : 'Edit Video',
                                    tagline: `let’s ${
                                        newVideo ? `Upload` : `Edit`
                                    } Video For Your User`,
                                }}
                                Icon={FileVideoIcon}
                                onClose={onClose}
                            />
                            {topicFields.map((topic, index) => (
                                <div key={topic.id}>
                                    <div className="flex flex-col space-y-1 mt-2">
                                        <Label
                                            htmlFor={`video.topics[${index}].name`}
                                            className="font-semibold text-md"
                                        >
                                            Topic Name
                                        </Label>
                                        <Input
                                            name={`video.topics[${index}].name`}
                                            inputValue={
                                                (topic as { name: string }).name
                                            }
                                            placeholder="Enter Topic Name"
                                            type="text"
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message:
                                                        validationError.REQUIRED_FIELD,
                                                },
                                            }}
                                        />
                                    </div>
                                    <span className="text-red-500 text-xs">
                                        <ErrorMessage
                                            errors={errors}
                                            name={`video.topics[${index}].name`}
                                            render={({ message }) => (
                                                <p className="flex items-center">
                                                    <X
                                                        size={20}
                                                        color="#E6500D"
                                                    />
                                                    {message}
                                                </p>
                                            )}
                                        />
                                    </span>
                                    <div className="flex flex-col space-y-1 mt-2">
                                        <Label
                                            htmlFor={`video.topics[${index}].timeline`}
                                            className="font-semibold text-md"
                                        >
                                            Timeline
                                        </Label>
                                        <Input
                                            name={`video.topics[${index}].timeline`}
                                            inputValue={
                                                (topic as { timeline: string })
                                                    .timeline
                                            }
                                            placeholder="Enter The Start Time"
                                            type="text"
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message:
                                                        validationError.REQUIRED_FIELD,
                                                },
                                                pattern: {
                                                    value: /^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/,
                                                    message:
                                                        'Enter the time in the format HH:MM:SS (00:00:00 - 23:59:59)',
                                                },
                                                validate: (value: string) => {
                                                    const timelineSeconds =
                                                        timeStringToSeconds(
                                                            value
                                                        );
                                                    const duration = newVideo
                                                        ? newVideoDuration ||
                                                          '00:00:00'
                                                        : originalVideoData.duration;
                                                    if (
                                                        timelineSeconds >
                                                        timeStringToSeconds(
                                                            duration
                                                        )
                                                    ) {
                                                        return `Timeline exceeds video duration ${duration}`;
                                                    }
                                                    return true;
                                                },
                                            }}
                                        />
                                        <span className="text-red-500 text-xs">
                                            <ErrorMessage
                                                errors={errors}
                                                name={`video.topics[${index}].timeline`}
                                                render={({ message }) => (
                                                    <p className="flex items-center">
                                                        <X
                                                            size={20}
                                                            color="#E6500D"
                                                        />
                                                        {message}
                                                    </p>
                                                )}
                                            />
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeTopic(index)}
                                        className="cursor-pointer p-2 w-full rounded-lg bg-red-500 text-white text-center mt-5"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <div className="flex flex-row gap-4">
                                <button
                                    type="button"
                                    className="cursor-pointer p-2 w-full rounded-lg bg-primary-color text-white text-center mt-5"
                                    onClick={() =>
                                        appendTopic({
                                            timeline: '',
                                            name: '',
                                        })
                                    }
                                >
                                    Add Topic
                                </button>
                                <button
                                    type="submit"
                                    className="cursor-pointer p-2 w-full rounded-lg bg-primary-color text-white text-center mt-5"
                                >
                                    {buttonLoading ? (
                                        <ButtonLoader />
                                    ) : (
                                        `Save Changes`
                                    )}
                                </button>
                            </div>
                        </div>

                        <div onClick={onClose}>
                            <ModalFooter text="Finish" buttonType="button" />
                        </div>
                    </form>
                </FormProvider>
            )}
        </section>
    );
}

export default EditTopicsModal;
