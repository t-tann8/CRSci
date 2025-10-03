'use client';

import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import action from '@/app/action';
import {
    validationError,
    ResourceType,
    trimAndConvertSpaces,
} from '@/lib/utils';
import Input from '@/app/components/common/Input';
import { Label } from '@/app/components/ui/label';
import { ErrorMessage } from '@hookform/error-message';
import ButtonLoader from '@/app/components/common/ButtonLoader';
import { createStandardAPI, updateStandardAPI } from '@/app/api/standard';
import CreateTopic from '../CreateTopic';

interface Topic {
    resourceId: string;
    type: ResourceType;
    name: string;
    weightage: number;
}
interface DailyUpload {
    topics: Topic[];
    dayName: string;
    accessibleDay: number;
    topicName: { value: string }[];
}
interface Standard {
    name: string;
    description: string;
    dailyUploads: DailyUpload[];
    topicsDescriptions: { topicName: string; description: string }[];
}
interface FormValues {
    standard: Standard;
}
const DEFAULT_STANDARD = {
    name: '',
    description: '',
    topicsDescriptions: [{ topicName: '', description: '' }],
    dailyUploads: [
        {
            topicName: [{ value: '' }],
            accessibleDay: 0,
            topics: [
                {
                    resourceId: '',
                    type: ResourceType.VIDEO,
                    name: '',
                    weightage: 0,
                },
            ],
        },
    ],
};
const DEFAULT_FORM_VALUES = {
    standard: DEFAULT_STANDARD,
};

function CreateStandard({
    standardId,
    name,
    description,
    topicsDescriptions,
    dailyUploads,
    update,
}: {
    standardId?: string;
    name?: string;
    description?: string;
    topicsDescriptions?: { topicName: string; description: string }[];
    dailyUploads?: DailyUpload[];
    update: boolean;
}) {
    const { data } = useSession();
    const dailyUploadAddedRef = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
    const transformedData = {
        standard: {
            name: name ?? '',
            description: description ?? '',
            topicsDescriptions: topicsDescriptions ?? [
                { topicName: '', description: '' },
            ],
            dailyUploads:
                dailyUploads?.map((upload) => ({
                    topicName: upload.topicName.map((tn) => ({
                        value: tn.value,
                    })),
                    accessibleDay: upload.accessibleDay,
                    dayName: upload.dayName,
                    topics: upload.topics.map((resource) => ({
                        resourceId: resource.resourceId,
                        name: resource.name,
                        type: resource.type,
                        weightage: resource.weightage,
                    })),
                })) ?? [],
        },
    };
    const defaultSelectedResources =
        dailyUploads &&
        dailyUploads.map((upload) =>
            upload.topics.map((resource) => ({
                resourceId: resource.resourceId,
                resourceType: resource.type,
                name: resource.name,
                weightage: resource.weightage,
            }))
        );
    const [allSelectedResources, setAllSelectedResources] = useState<
        {
            resourceId: string;
            resourceType: ResourceType;
            name: string;
            weightage: number;
        }[][]
    >(
        defaultSelectedResources && defaultSelectedResources.length > 0
            ? defaultSelectedResources
            : [
                  [
                      {
                          resourceId: '',
                          resourceType: ResourceType.VIDEO,
                          name: '',
                          weightage: 0,
                      },
                  ],
              ]
    );

    const methods = useForm<FormValues>({
        defaultValues: update ? transformedData : DEFAULT_FORM_VALUES,
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
    } = methods;

    const {
        fields: topicDescriptionFields,
        append: appendTopicDescription,
        remove: removeTopicDescription,
    } = useFieldArray<FormValues>({
        control,
        name: 'standard.topicsDescriptions',
    });

    const {
        fields: dailyUploadFields,
        append: appendDailyUpload,
        remove: removeDailyUpload,
    } = useFieldArray<FormValues>({
        control,
        name: 'standard.dailyUploads',
    });

    const watchedtopicsDescriptions = methods.watch(
        'standard.topicsDescriptions'
    );
    const topicOptions = watchedtopicsDescriptions?.length
        ? watchedtopicsDescriptions.map((topic) => ({
              label: topic.topicName,
              value: topic.topicName,
          }))
        : [];

    const onSubmit = async (formdata: FormValues) => {
        if (!data) {
            return;
        }
        const allResourcesSelected = allSelectedResources.every((resources) =>
            resources.every((resource) => resource.resourceId !== '')
        );
        if (!allResourcesSelected) {
            toast.error('Please select all resources before submitting');
            return;
        }

        const totalWeightage = formdata.standard.dailyUploads.reduce(
            (total, dailyUpload) => {
                const dailyTotal = dailyUpload.topics.reduce(
                    (dailySum, topic) => dailySum + Number(topic.weightage),
                    0
                );
                return total + dailyTotal;
            },
            0
        );
        if (totalWeightage !== 100) {
            toast.error('The sum of all weightages should be 100');
            return;
        }

        const transformedTopics = formdata.standard.topicsDescriptions.map(
            (topicDescription) => ({
                name: trimAndConvertSpaces(topicDescription.topicName),
                description: topicDescription.description,
            })
        );

        const transformedDailyUploads = formdata.standard.dailyUploads
            .map((dailyUpload, index) =>
                dailyUpload.topics.map((topic, topicIndex) => ({
                    resourceId:
                        allSelectedResources[index][topicIndex]?.resourceId,
                    topicName: dailyUpload.topicName.flatMap((tn) =>
                        trimAndConvertSpaces(tn.value)
                    ),
                    accessibleDay: dailyUpload.accessibleDay,
                    dayName: dailyUpload.dayName,
                    weightage: topic?.weightage || 0,
                    type: topic.type,
                }))
            )
            .flat();

        const result = Array.isArray(transformedDailyUploads)
            ? transformedDailyUploads
            : [transformedDailyUploads];

        try {
            setIsLoading(true);
            let response: any = null;
            if (update) {
                response = await updateStandardAPI({
                    standardId: standardId || '',
                    name: formdata.standard.name,
                    description: formdata.standard.description,
                    dailyUploads: result,
                    topics: transformedTopics,
                    accessToken: data?.user?.accessToken || '',
                });
            } else {
                response = await createStandardAPI({
                    name: formdata.standard.name,
                    description: formdata.standard.description,
                    dailyUploads: transformedDailyUploads,
                    topics: transformedTopics,
                    accessToken: data?.user?.accessToken || '',
                });
            }
            if (response.status !== 200) {
                toast.error(
                    response?.message ||
                        `Failed to ${update ? `update ` : `create`} a standard`
                );
                return;
            }
            toast.success(
                `Standard ${update ? `updated ` : `created`} successfully`
            );
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    `Failed to ${update ? `update ` : `create`} a standard`
            );
        } finally {
            setIsLoading(false);
            action('getAllSummarizedStandards');
        }
    };

    useEffect(() => {
        if (!data) {
            return;
        }
        if (dailyUploadFields.length === 0 && !dailyUploadAddedRef.current) {
            appendDailyUpload({
                topicName: [{ value: '' }],
                accessibleDay: 0,
                dayName: '',
                topics: [
                    {
                        resourceId: '',
                        type: ResourceType.VIDEO,
                        name: '',
                        weightage: 0,
                    },
                ],
            });
            dailyUploadAddedRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        const updatedResources = [...allSelectedResources];
        const indexToRemove = updatedResources.findIndex(
            (resources) => resources.length === 0
        );

        if (indexToRemove !== -1) {
            updatedResources.splice(indexToRemove, 1);
            setAllSelectedResources(updatedResources);
            removeDailyUpload(indexToRemove);
        }
    }, [allSelectedResources, removeDailyUpload]);

    return (
        <section>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-3 pb-3 border-b">
                        <h3 className="text-xl font-semibold">
                            Standard Details
                        </h3>
                        <div className="sm:flex justify-between items-center gap-5 w-full mt-5">
                            <div className="basis-1/2">
                                <Label htmlFor="standard.name">
                                    Standard Name
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Write Standard Name"
                                    name="standard.name"
                                    rules={{
                                        required: {
                                            value: true,
                                            message:
                                                validationError.REQUIRED_FIELD,
                                        },
                                    }}
                                />
                                <span className="text-red-500 text-xs">
                                    <ErrorMessage
                                        errors={errors}
                                        name="standard.name"
                                        render={({ message }) => (
                                            <p className="flex items-center">
                                                <X size={20} color="#E6500D" />
                                                {message}
                                            </p>
                                        )}
                                    />
                                </span>
                            </div>
                            <div className="basis-1/2">
                                <Label htmlFor="standard.description">
                                    Description
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Write Description Here"
                                    name="standard.description"
                                    rules={{
                                        required: {
                                            value: true,
                                            message:
                                                validationError.REQUIRED_FIELD,
                                        },
                                    }}
                                />
                                <span className="text-red-500 text-xs">
                                    <ErrorMessage
                                        errors={errors}
                                        name="standard.description"
                                        render={({ message }) => (
                                            <p className="flex items-center">
                                                <X size={20} color="#E6500D" />
                                                {message}
                                            </p>
                                        )}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 pb-3 border-b">
                        <h3 className="text-xl font-semibold">
                            Topic Descriptions
                        </h3>
                        {topicDescriptionFields.map((field, index) => (
                            <div
                                key={field.id}
                                className="sm:flex justify-between items-center gap-5 w-full mt-5"
                            >
                                <div className="basis-1/2">
                                    <Label
                                        htmlFor={`standard.topicsDescriptions[${index}].topicName`}
                                    >
                                        Topic Name
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Write Topic Name"
                                        name={`standard.topicsDescriptions[${index}].topicName`}
                                        rules={{
                                            required: {
                                                value: true,
                                                message:
                                                    validationError.REQUIRED_FIELD,
                                            },
                                        }}
                                    />
                                    <span className="text-red-500 text-xs">
                                        <ErrorMessage
                                            errors={errors}
                                            name={`standard.topicsDescriptions[${index}].topicName`}
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
                                <div className="basis-1/2">
                                    <Label
                                        htmlFor={`standard.topicsDescriptions[${index}].description`}
                                    >
                                        Description
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Write Description Here"
                                        name={`standard.topicsDescriptions[${index}].description`}
                                        rules={{
                                            required: {
                                                value: true,
                                                message:
                                                    validationError.REQUIRED_FIELD,
                                            },
                                        }}
                                    />
                                    <span className="text-red-500 text-xs">
                                        <ErrorMessage
                                            errors={errors}
                                            name={`standard.topicsDescriptions[${index}].description`}
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
                                    className="cursor-pointer p-3 border text-center text-sm rounded-lg w-24 bg-red-500 text-gray-50 hover:bg-red-600 mt-5"
                                    onClick={() =>
                                        removeTopicDescription(index)
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="bg-primary-color hover:bg-orange-400 text-white font-medium p-3 mt-3 rounded-lg"
                            onClick={() =>
                                appendTopicDescription({
                                    topicName: '',
                                    description: '',
                                })
                            }
                        >
                            Add Topic Description
                        </button>
                        <button
                            type="button"
                            className="bg-primary-color hover:bg-orange-400 text-white font-medium p-3 mt-3 ml-3 rounded-lg"
                            onClick={() => {
                                trigger('standard.topicsDescriptions');
                            }}
                        >
                            Submit Topics
                        </button>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mt-5 mb-4">
                            <button
                                type="submit"
                                className="bg-primary-color hover:bg-orange-400 text-white font-medium p-3 mt-3 rounded-lg w-32"
                            >
                                {isLoading ? <ButtonLoader /> : `Submit`}
                            </button>
                            <button
                                type="button"
                                className="bg-primary-color hover:bg-orange-400 text-white font-medium p-3 mt-3 rounded-lg"
                                onClick={() => {
                                    if (
                                        allSelectedResources[
                                            allSelectedResources.length - 1
                                        ] &&
                                        allSelectedResources[
                                            allSelectedResources.length - 1
                                        ].some(
                                            (resource) =>
                                                resource.resourceId === ''
                                        )
                                    ) {
                                        toast.error(
                                            'Please select all resources in last day before adding a new one'
                                        );
                                        return;
                                    }
                                    appendDailyUpload({
                                        topicName: [
                                            {
                                                value:
                                                    topicOptions[0]?.value ??
                                                    '',
                                            },
                                        ],
                                        accessibleDay: 0,
                                        dayName: '',
                                        topics: [
                                            {
                                                resourceId: '',
                                                type: ResourceType.VIDEO,
                                                name: '',
                                                weightage: 0,
                                            },
                                        ],
                                    });
                                    setAllSelectedResources([
                                        ...allSelectedResources,
                                        [
                                            {
                                                resourceId: '',
                                                resourceType:
                                                    ResourceType.VIDEO,
                                                name: '',
                                                weightage: 0,
                                            },
                                        ],
                                    ]);
                                }}
                            >
                                Add TimeLine
                            </button>
                        </div>
                        {dailyUploadFields.map((dailyUpload, index) => (
                            <div key={dailyUpload.id}>
                                <CreateTopic
                                    errors={errors}
                                    index={index}
                                    allSelectedResources={
                                        allSelectedResources[index]
                                    }
                                    setAllSelectedResources={(
                                        resources: {
                                            resourceId: string;
                                            resourceType: ResourceType;
                                            name: string;
                                            weightage: number;
                                        }[]
                                    ) => {
                                        const updatedResources = [
                                            ...allSelectedResources,
                                        ];
                                        updatedResources[index] = resources;
                                        setAllSelectedResources(
                                            updatedResources
                                        );
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </form>
            </FormProvider>
        </section>
    );
}

export default CreateStandard;
