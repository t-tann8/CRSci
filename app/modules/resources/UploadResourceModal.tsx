import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import {
    useForm,
    SubmitHandler,
    FieldValues,
    FormProvider,
} from 'react-hook-form';
import {
    validationError,
    resourceDropDownOptions,
    ResourceType,
    resourceTypeToIcon,
    secondsToString,
} from '@/lib/utils';
import action from '@/app/action';
import Input from '@/app/components/common/Input';
import { Label } from '@/app/components/ui/label';
import { UploadResource } from '@/app/api/s3Bucket';
import Select from '@/app/components/common/DropDown';
import { createResourceAPI } from '@/app/api/resource';
import ResourceIcon from '@/app/assets/icons/ResourceIcon';
import UploadItem from '@/app/components/common/UploadItem';
import ModalFooter from '@/app/components/common/ModalFooter';
import FileUploading from '@/app/components/common/FileUploading';
import { ModalHeader } from '@/app/components/common/ModalHeader';
import { OptionsInterface } from '@/app/components/common/AppDropDown';

export const resourceTypeOptions: OptionsInterface[] = [
    ...resourceDropDownOptions,
];

// type for the form data
type ResourceFormData = {
    topic: string;
    type: string;
    name: string;
    thumbnail?: File;
    totalMarks?: number;
    URL?: string;
    selectedUploadOption: string;
    deadline?: number;
};

const videoUploadOptions = [
    { label: 'file', value: 'File' },
    { label: 'youtube', value: 'Youtube' },
];

const slideUploadOptions = [
    { label: 'file', value: 'File' },
    { label: 'googleSlides', value: 'Google Slide' },
];

function UploadResourceModal({ onClose }: any) {
    const { data } = useSession();
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const methods = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        // defaultValues: {
        //     topic: '',
        //     type: 'lab',
        //     name: '',
        //     thumbnail: null,
        //     totalMarks: 0,
        //     URL: '',
        //     selectedUploadOption: '',
        //     deadline: 0,
        // },
    });
    const resourceName = methods.watch('name');
    const resourceType = methods.watch('type');
    const thumbnailFile = methods.watch('thumbnail');
    const selectedUploadOption = methods.watch('selectedUploadOption');

    const convertYouTubeDuration = (duration: string) => {
        const match = duration.match(/PT((\d+)H)?((\d+)M)?((\d+)S)?/);

        const hours = (match && parseInt(match[2], 10)) || 0;
        const minutes = (match && parseInt(match[4], 10)) || 0;
        const seconds = (match && parseInt(match[6], 10)) || 0;

        return hours * 3600 + minutes * 60 + seconds;
    };

    const getVideoDuration = async (videoSource: string | File) => {
        let videoDuration = 0;

        if (
            typeof videoSource === 'string' &&
            videoSource.includes('youtube')
        ) {
            const videoId = new URL(videoSource).searchParams.get('v');
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${process.env.NEXT_PUBLIC_YOUTUBE_KEY}`
            );
            const data = await response.json();
            videoDuration = convertYouTubeDuration(
                data.items[0].contentDetails.duration
            );
        } else if (typeof videoSource !== 'string') {
            videoDuration = await new Promise((resolve, reject) => {
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = () => {
                    URL.revokeObjectURL(video.src);
                    resolve(video.duration);
                };
                video.onerror = () => {
                    reject(new Error('Failed to load video metadata.'));
                };
                video.src = URL.createObjectURL(videoSource);
            });
        }

        return videoDuration;
    };

    const uploadFile = async (file: File) => {
        const response: any = await UploadResource({
            selectedFile: file,
            userId: data?.user?.id,
            onUploadProgress: (progressEvent) => {
                const percentage = Math.round(
                    (progressEvent.loaded * 50) / progressEvent.total
                );
                setProgress(percentage);
            },
        });

        if (response?.status !== 200) {
            toast.error(response?.message || 'Upload Failed');
            return null;
        }

        return response?.data?.url;
    };

    const createResource = async (
        url: string,
        formData: ResourceFormData,
        thumbnailURL?: string,
        duration?: string
    ) => {
        const resourceData: any = {
            accessToken: data?.user?.accessToken ?? '',
            name: formData.name,
            topic: formData.topic,
            type: formData.type,
            totalMarks: formData?.totalMarks,
            deadline: formData?.deadline,
            url,
            duration,
            onUploadProgress: (progressEvent: {
                loaded: number;
                total: number;
            }) => {
                const percentage = Math.round(
                    (progressEvent.loaded * 50) / progressEvent.total + 50
                );
                setProgress(percentage);
            },
        };

        if (formData.type === ResourceType.VIDEO) {
            resourceData.thumbnailURL = thumbnailURL;
        }

        const response: any = await createResourceAPI(resourceData);

        if (response?.status !== 200) {
            toast.error(response?.message || 'Resource Upload Failed');
        }
    };

    const handleUpload = async (formData: ResourceFormData) => {
        try {
            setLoading(true);
            if (!data?.user.accessToken) {
                return toast.error('Token Expired, Please Sign in Again');
            }

            let response: { status: number } = { status: 200 };
            if (resourceType === ResourceType.VIDEO) {
                response = await handleVideoUpload(formData);
            } else {
                response = await handleFileUpload(formData);
            }

            if (response.status !== 200) {
                return toast.error('Failed to upload resource');
            }

            await refreshResources();

            onClose();
            return toast.success('Resource Uploaded Successfully');
        } catch (error: any) {
            return toast.error(
                error?.response?.data?.message || 'An unexpected error occurred'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVideoUpload = async (formData: ResourceFormData) => {
        if (!formData.thumbnail) {
            toast.error('Please Select Thumbnail');
            return { status: 400 };
        }
        const thumbnailURL = await uploadFile(thumbnailFile['0']);

        let resourceURL = '';
        let videoDuration = 0;

        if (selectedUploadOption === 'youtube') {
            if (!formData.URL) {
                toast.error('Please Enter Youtube URL');
                return { status: 400 };
            }
            resourceURL = formData.URL;
            videoDuration = await getVideoDuration(formData.URL);
        } else {
            if (!selectedFile) {
                toast.error('Please Select File');
                return { status: 400 };
            }
            videoDuration = await getVideoDuration(selectedFile);
            resourceURL = await uploadFile(selectedFile);
        }

        if (!resourceURL) {
            toast.error('Failed to upload resource');
            return { status: 400 };
        }

        await createResource(
            resourceURL,
            formData,
            thumbnailURL,
            secondsToString(videoDuration) || '00:00:00'
        );

        return { status: 200 };
    };

    const handleFileUpload = async (formData: ResourceFormData) => {
        let resourceURL = '';
        if (selectedUploadOption === 'googleSlides') {
            if (!formData.URL) {
                toast.error('Please Enter Google Slides URL');
                return { status: 400 };
            }
            resourceURL = formData.URL;
        } else {
            if (!selectedFile) {
                toast.error('Please Select File');
                return { status: 400 };
            }
            resourceURL = await uploadFile(selectedFile);
        }
        if (!resourceURL) {
            toast.error('Failed to upload file');
            return { status: 400 };
        }

        await createResource(resourceURL, formData);

        return { status: 200 };
    };

    const refreshResources = async () => {
        await Promise.all([
            action('getResources'),
            action('getResourcesCount'),
        ]);
    };

    const Icon = resourceTypeToIcon(resourceType);

    return (
        <section className="w-full bg-white h-screen py-4 shadow-lg overflow-y-auto">
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(
                        handleUpload as SubmitHandler<FieldValues>
                    )}
                >
                    <div className="px-6 mb-24">
                        <ModalHeader
                            headerText={{
                                heading: 'Upload Resource',
                                tagline: 'Upload Resource For Your User',
                            }}
                            Icon={ResourceIcon}
                            onClose={onClose}
                        />
                        <div className="flex flex-col space-y-2 mt-1">
                            <Label
                                htmlFor="type"
                                className="font-semibold text-md"
                            >
                                Resource Type
                            </Label>
                            <Select
                                name="type"
                                additionalClasses="font-semibold text-md"
                                options={resourceTypeOptions}
                                rules={{
                                    required: {
                                        value: true,
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                }}
                            />
                        </div>
                        <div className="flex flex-col space-y-1 mt-5">
                            <Label
                                htmlFor="topic"
                                className="font-semibold text-md"
                            >
                                Assign Topic
                            </Label>
                            <Input
                                name="topic"
                                placeholder="Enter Topic"
                                type="text"
                                rules={{
                                    required: {
                                        value: true,
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                }}
                            />
                        </div>
                        <div className="flex flex-col space-y-1 mt-5">
                            <Label
                                htmlFor="name"
                                className="font-semibold text-md"
                            >
                                Name
                            </Label>
                            <Input
                                name="name"
                                placeholder="Enter Name"
                                type="text"
                                rules={{
                                    required: {
                                        value: true,
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                }}
                            />
                        </div>
                        {resourceType === ResourceType.VIDEO && (
                            <div className="flex flex-col space-y-1 mt-5">
                                <Label
                                    htmlFor="thumbnail"
                                    className="font-semibold text-md"
                                >
                                    Video Thumbnail
                                </Label>
                                <Input
                                    name="thumbnail"
                                    placeholder="Select Thumbnail"
                                    type="file"
                                    accept=".jpeg, .png, .jpg"
                                    rules={{
                                        required: {
                                            value: true,
                                            message:
                                                validationError.REQUIRED_FIELD,
                                        },
                                    }}
                                />
                            </div>
                        )}
                        {(resourceType === ResourceType.QUIZ ||
                            resourceType === ResourceType.WORKSHEET ||
                            resourceType === ResourceType.ASSIGNMENT ||
                            resourceType ===
                                ResourceType.FORMATIVE_ASSESSMENT ||
                            resourceType ===
                                ResourceType.SUMMARIZE_ASSESSMENT) && (
                            <div className="flex flex-col space-y-1 mt-5">
                                <Label
                                    htmlFor="totalMarks"
                                    className="font-semibold text-md"
                                >
                                    Marks
                                </Label>
                                <Input
                                    name="totalMarks"
                                    placeholder="Add Total Marks"
                                    type="number"
                                    rules={{
                                        required: {
                                            value: true,
                                            message:
                                                validationError.REQUIRED_FIELD,
                                        },
                                        min: {
                                            value: 0,
                                            message:
                                                'Marks must be a minimum of 0',
                                        },
                                    }}
                                />
                            </div>
                        )}
                        {(resourceType === ResourceType.QUIZ ||
                            resourceType === ResourceType.WORKSHEET ||
                            resourceType === ResourceType.ASSIGNMENT ||
                            resourceType ===
                                ResourceType.FORMATIVE_ASSESSMENT ||
                            resourceType ===
                                ResourceType.SUMMARIZE_ASSESSMENT) && (
                            <div className="flex flex-col space-y-1 mt-5">
                                <Label
                                    htmlFor="deadline"
                                    className="font-semibold text-md"
                                >
                                    Deadline
                                </Label>
                                <Input
                                    name="deadline"
                                    placeholder="Add Number of Days as Deadline For Submission"
                                    type="number"
                                    rules={{
                                        required: {
                                            value: true,
                                            message:
                                                validationError.REQUIRED_FIELD,
                                        },
                                        min: {
                                            value: 0,
                                            message:
                                                'Deadline must have a minimum of 0 day',
                                        },
                                    }}
                                />
                            </div>
                        )}
                        {(resourceType === ResourceType.VIDEO ||
                            resourceType === ResourceType.SLIDESHOW) && (
                            <div className="flex flex-col space-y-1 mt-4">
                                <Label
                                    htmlFor="selectedUploadOption"
                                    className="font-semibold mt-3"
                                >
                                    Upload Type
                                </Label>
                                <Select
                                    name="selectedUploadOption"
                                    options={
                                        resourceType === ResourceType.VIDEO
                                            ? videoUploadOptions
                                            : slideUploadOptions
                                    }
                                    rules={{
                                        required: {
                                            value: true,
                                            message:
                                                validationError.REQUIRED_FIELD,
                                        },
                                    }}
                                />
                            </div>
                        )}
                        <div className="mt-4">
                            {((resourceType === ResourceType.VIDEO &&
                                selectedUploadOption === 'youtube') ||
                                (resourceType === ResourceType.SLIDESHOW &&
                                    selectedUploadOption === 'googleSlides')) &&
                                progress === 0 && (
                                    <div className="flex flex-col space-y-1 mt-5">
                                        <Label
                                            htmlFor="URL"
                                            className="font-semibold text-md"
                                        >
                                            {resourceType === ResourceType.VIDEO
                                                ? `Youtube URL`
                                                : `Google Slides URL`}
                                        </Label>
                                        <Input
                                            name="URL"
                                            placeholder={
                                                resourceType ===
                                                ResourceType.VIDEO
                                                    ? `Provide Youtube URL`
                                                    : `Provide Google Slides URL`
                                            }
                                            type="input"
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message:
                                                        validationError.REQUIRED_FIELD,
                                                },
                                            }}
                                        />
                                    </div>
                                )}
                            {((resourceType === ResourceType.VIDEO &&
                                selectedUploadOption === 'youtube') ||
                                (resourceType === ResourceType.SLIDESHOW &&
                                    selectedUploadOption === 'googleSlides')) &&
                                progress !== 0 && (
                                    <div className="mt-4">
                                        <FileUploading
                                            fileName={resourceName}
                                            progress={progress}
                                            Icon={Icon}
                                        />
                                    </div>
                                )}
                            {((resourceType === ResourceType.VIDEO &&
                                selectedUploadOption !== 'youtube') ||
                                (resourceType === ResourceType.SLIDESHOW &&
                                    selectedUploadOption !== 'googleSlides') ||
                                (resourceType !== ResourceType.VIDEO &&
                                    resourceType !==
                                        ResourceType.SLIDESHOW)) && (
                                <>
                                    {!selectedFile && (
                                        <UploadItem
                                            resourceType={
                                                resourceType ??
                                                ResourceType.SLIDESHOW
                                            }
                                            itemName="Resource"
                                            setSelectedFile={setSelectedFile}
                                        />
                                    )}
                                    {selectedFile && (
                                        <FileUploading
                                            fileName={selectedFile.name}
                                            progress={progress}
                                            Icon={Icon}
                                        />
                                    )}
                                </>
                            )}
                            {(selectedUploadOption !== 'youtube' ||
                                selectedUploadOption !== 'googleSlides') && (
                                <div
                                    className="p-2 rounded-lg border w-32 text-center mt-3 text-dark-gray cursor-pointer hover:bg-dark-gray hover:text-light-gray"
                                    onClick={() => setSelectedFile(null)}
                                >
                                    <button type="button" className="text-sm">
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <ModalFooter text="Upload" loading={loading} />
                </form>
            </FormProvider>
        </section>
    );
}

export default UploadResourceModal;
