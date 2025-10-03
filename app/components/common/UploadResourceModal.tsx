import React from 'react';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { FileVideoIcon, LucideIcon } from 'lucide-react';
import {
    useForm,
    SubmitHandler,
    FieldValues,
    FormProvider,
} from 'react-hook-form';
import { Label } from '@/app/components/ui/label';
import Input from '@/app/components/common/Input';
import { UploadResource } from '@/app/api/s3Bucket';
import { createResourceAPI } from '@/app/api/resource';
import { validationError, ResourceType, secondsToString } from '@/lib/utils';
import UploadItem from '@/app//components/common/UploadItem';
import ModalFooter from '@/app/components/common/ModalFooter';
import FileUploading from '@/app/components/common/FileUploading';
import { ModalHeader } from '@/app/components/common/ModalHeader';
import action from '@/app/action';
import Select from './DropDown';

type ResourceFormData = {
    topic: string;
    name: string;
    thumbnail?: File;
    selectedUploadOption: string;
    youtubeURL?: string;
};

interface UploadResourceModalProp {
    headerText: string;
    description: string;
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
    isDisplayHeaderIcon?: boolean;
    buttonText: string;
    onClose?: () => void;
    onButtonClick?: () => void;
    setUploadedVideoId?: (id: string) => void;
    setVideoDuration?: (duration: string) => void;
}

const uploadOptions = [
    { label: 'file', value: 'File' },
    { label: 'youtube', value: 'Youtube' },
];

function UploadResourceModal({
    headerText,
    description,
    Icon,
    buttonText,
    isDisplayHeaderIcon,
    onClose,
    onButtonClick,
    setUploadedVideoId,
    setVideoDuration,
}: UploadResourceModalProp) {
    const { data } = useSession();
    const [progress, setProgress] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const methods = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });
    const videoName = methods.watch('name');
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

        if (setVideoDuration) {
            setVideoDuration(secondsToString(videoDuration));
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
            type: ResourceType.VIDEO,
            thumbnailURL,
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

        const response: any = await createResourceAPI(resourceData);

        if (response?.status !== 200) {
            toast.error(response?.message || 'Resource Upload Failed');
        }

        return response;
    };

    const handleUpload = async (formData: ResourceFormData) => {
        try {
            if (!data?.user.accessToken) {
                return toast.error('Token Expire, Please Signin Again');
            }
            if (!selectedFile && selectedUploadOption === 'file') {
                return toast.error('Please Select File');
            }
            setLoading(true);
            let resourceURL = '';
            let videoDuration = 0;
            if (selectedFile && selectedUploadOption === 'file') {
                videoDuration = await getVideoDuration(selectedFile);
                resourceURL = await uploadFile(selectedFile);
                if (!resourceURL) {
                    return null;
                }
            } else {
                resourceURL = formData?.youtubeURL ?? '';
                videoDuration = await getVideoDuration(resourceURL);
            }

            if (!formData.thumbnail) {
                return toast.error('Please Select Thumbnail');
            }
            const thumbnailURL = await uploadFile(thumbnailFile['0']);
            const createResponse: any = await createResource(
                resourceURL,
                formData,
                thumbnailURL,
                secondsToString(videoDuration) || '00:00:00'
            );
            const APIdata = createResponse?.data;

            const videoId = APIdata?.data?.videoAttributes?.id ?? '';

            if (setUploadedVideoId) {
                setUploadedVideoId(videoId);
            }

            if (onButtonClick) {
                onButtonClick();
            }

            await action('getVideos');
            return toast.success('Video Uploaded Successfully');
        } catch (error: any) {
            return toast.error(error?.message);
        } finally {
            setLoading(false);
        }
    };

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
                                heading: headerText,
                                tagline: description,
                            }}
                            Icon={
                                isDisplayHeaderIcon ? FileVideoIcon : undefined
                            }
                            onClose={onClose}
                        />
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
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                }}
                            />
                        </div>
                        <div className="flex flex-col space-y-1 mt-4">
                            <Label
                                htmlFor="selectedUploadOption"
                                className="font-semibold mt-3 text-md"
                            >
                                Upload Type
                            </Label>
                            <Select
                                name="selectedUploadOption"
                                options={uploadOptions}
                                rules={{
                                    required: {
                                        value: true,
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                }}
                            />
                        </div>
                        {selectedUploadOption !== 'youtube' &&
                            progress === 0 && (
                                <div className="mt-4 mb-3">
                                    {!selectedFile && (
                                        <UploadItem
                                            resourceType={ResourceType.VIDEO}
                                            itemName="Video"
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
                                </div>
                            )}
                        {selectedUploadOption === 'youtube' &&
                            progress === 0 && (
                                <div className="flex flex-col space-y-1 mt-5">
                                    <Label
                                        htmlFor="youtubeURL"
                                        className="font-semibold text-md"
                                    >
                                        Youtube URL
                                    </Label>
                                    <Input
                                        name="youtubeURL"
                                        placeholder="Provide youtube URL"
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
                        {progress !== 0 && (
                            <div className="mt-4">
                                <FileUploading
                                    fileName={videoName}
                                    progress={progress}
                                    Icon={Icon}
                                />
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 w-full">
                        <ModalFooter text={buttonText} loading={loading} />
                    </div>
                </form>
            </FormProvider>
        </section>
    );
}

export default UploadResourceModal;
