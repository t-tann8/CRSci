/* eslint-disable react/no-array-index-key */
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { FileVideoIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
    useForm,
    SubmitHandler,
    FieldValues,
    FormProvider,
} from 'react-hook-form';
import {
    secondsToString,
    timeStringToSeconds,
    validationError,
} from '@/lib/utils';
import Input from '@/app/components/common/Input';
import { Label } from '@/app/components/ui/label';
import { addTopicsInVideoAPI } from '@/app/api/video';
import ModalFooter from '@/app/components/common/ModalFooter';
import action from '@/app/action';
import { ModalHeader } from '../../components/common/ModalHeader';

interface Topic {
    name: string;
    timeline: string;
    videoDuration?: number;
}

type ResourceFormData = {
    timeline: string;
    topicName: string;
};

function CheckPointsModal({
    videoId,
    onClose,
    videoDuration,
}: {
    videoId: string;
    onClose: () => void;
    videoDuration?: number;
}) {
    const { data } = useSession();
    const initialTopics: Topic[] = [];
    const [topics, setTopics] = useState(initialTopics);
    const methods = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const addTopic = (formData: ResourceFormData) => {
        const newTopic = {
            name: formData.topicName,
            timeline: formData.timeline,
        };
        setTopics((prevTopics) => [...prevTopics, newTopic]);
        methods.reset();
    };

    const onFormSubmit = async () => {
        try {
            // Transform each question in the questions array
            const transformedTopics: { [key: string]: string } = {};
            topics.forEach((topic) => {
                transformedTopics[topic.timeline] = topic.name;
            });

            const response: any = await addTopicsInVideoAPI({
                videoId,
                topics: transformedTopics,
                accessToken: data?.user?.accessToken || '',
            });

            if (response.status !== 200) {
                return toast.error(
                    response?.message || 'Failed to add question'
                );
            }

            if (onClose) {
                onClose();
            }
            await action('getVideos');
            return toast.success('Question added successfully');
        } catch (error: any) {
            return toast.error(error?.message || 'Failed to add question');
        }
    };

    return (
        <section className="w-full bg-white h-screen py-4 shadow-md">
            <div className="h-[90%] overflow-y-auto w-full px-6">
                <ModalHeader
                    headerText={{
                        heading: 'Set Checkpoints',
                        tagline: 'Set Check points For better Understanding',
                    }}
                    Icon={FileVideoIcon}
                    onClose={onClose}
                />

                {/* <FileUploading isCompleted progress={0} /> */}
                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(
                            addTopic as SubmitHandler<FieldValues>
                        )}
                    >
                        <div className="flex flex-col space-y-1 mt-2">
                            <Label
                                htmlFor="topicName"
                                className="font-semibold text-md"
                            >
                                Topic
                            </Label>
                            <Input
                                name="topicName"
                                placeholder="Enter Question Statement"
                                type="text"
                                rules={{
                                    required: {
                                        value: true,
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                }}
                            />
                        </div>
                        <div className="flex flex-col space-y-1 mt-2">
                            <Label
                                htmlFor="timeline"
                                className="font-semibold text-md"
                            >
                                Timeline
                            </Label>
                            <Input
                                name="timeline"
                                placeholder="Enter Question Statement"
                                type="text"
                                rules={{
                                    required: {
                                        value: true,
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                    pattern: {
                                        value: /^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/,
                                        message:
                                            'Enter the time in the format HH:MM:SS (00:00:00 - 23:59:59)',
                                    },
                                    validate: (value: string) => {
                                        const timelineSeconds =
                                            timeStringToSeconds(value);
                                        if (
                                            videoDuration !== 0 &&
                                            timelineSeconds >
                                                (videoDuration ?? 0)
                                        ) {
                                            return `Timeline exceeds video duration ${secondsToString(
                                                videoDuration ?? 0
                                            )}`;
                                        }
                                        return true;
                                    },
                                }}
                            />
                        </div>
                        <div className=" mt-3 flex justify-end w-full">
                            <button
                                type="submit"
                                className="text-white text-sm w-fit text-center  bg-primary-color p-3 rounded-lg"
                            >
                                Add Check Point
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
            <div onClick={onFormSubmit}>
                <ModalFooter text="Upload Video" buttonType="button" />
            </div>
        </section>
    );
}

export default CheckPointsModal;
