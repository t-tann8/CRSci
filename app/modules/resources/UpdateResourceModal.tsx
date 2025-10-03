import React from 'react';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import {
    useForm,
    SubmitHandler,
    FieldValues,
    FormProvider,
    set,
} from 'react-hook-form';
import action from '@/app/action';
import { validationError, Resource, ResourceType } from '@/lib/utils';
import Input from '@/app/components/common/Input';
import { Label } from '@/app/components/ui/label';
import Select from '@/app/components/common/DropDown';
import ResourceIcon from '@/app/assets/icons/ResourceIcon';
import ModalFooter from '@/app/components/common/ModalFooter';
import { ModalHeader } from '@/app/components/common/ModalHeader';
import { updateResourceAPI } from '@/app/api/resource';
import { resourceTypeOptions } from '@/app/modules/resources/UploadResourceModal';

type ResourceFormData = {
    topic: string;
    type: string;
    name: string;
    totalMarks?: number;
    deadline?: number;
};

function UpdateResourceModal({
    onClose,
    resource,
}: {
    onClose: any;
    resource: Resource;
}) {
    const { data } = useSession();
    const [loading, setLoading] = React.useState(false);
    const methods = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const handleUpdate = async (formData: ResourceFormData) => {
        try {
            setLoading(true);
            // Upload resource to s3Bucket if selected
            if (data?.user?.accessToken) {
                const updateResponse: any = await updateResourceAPI({
                    resourceId: resource.id,
                    name: formData.name,
                    type: formData.type,
                    topic: formData.topic,
                    totalMarks: formData.totalMarks,
                    accessToken: data?.user?.accessToken,
                    deadline: formData.deadline,
                });
                if (updateResponse?.status !== 200) {
                    toast.error(
                        updateResponse?.message || 'Resource Update Failed'
                    );
                } else {
                    action('getResources');
                    toast.success('Resource Updated Successfully');
                }
            } else {
                toast.error('Token Expire, Please Signin Again');
            }
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Resource Update Failed'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full bg-white h-screen py-4  shadow-lg">
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(
                        handleUpdate as SubmitHandler<FieldValues>
                    )}
                >
                    <div className="h-[90%] overflow-y-auto w-full px-6">
                        <ModalHeader
                            headerText={{
                                heading: 'Update Resource',
                                tagline: 'Update Resource For Your User',
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
                                options={resourceTypeOptions}
                                rules={{
                                    required: {
                                        value: true,
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                }}
                                selectedOption={resource.type}
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
                                inputValue={resource.topic}
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
                                inputValue={resource.name}
                            />
                        </div>
                        {(resource.type === ResourceType.QUIZ ||
                            resource.type === ResourceType.WORKSHEET ||
                            resource.type === ResourceType.ASSIGNMENT ||
                            resource.type ===
                                ResourceType.FORMATIVE_ASSESSMENT ||
                            resource.type ===
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
                                    inputValue={
                                        resource.totalMarks?.toString() ?? '0'
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
                        {(resource.type === ResourceType.QUIZ ||
                            resource.type === ResourceType.WORKSHEET ||
                            resource.type === ResourceType.ASSIGNMENT ||
                            resource.type ===
                                ResourceType.FORMATIVE_ASSESSMENT ||
                            resource.type ===
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
                                    inputValue={
                                        resource.deadline?.toString() ?? '0'
                                    }
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
                    </div>
                    <ModalFooter text="Update" loading={loading} />
                </form>
            </FormProvider>
        </section>
    );
}

export default UpdateResourceModal;
