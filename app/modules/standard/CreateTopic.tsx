'use client';

import { toast } from 'react-toastify';
import { FileUpIcon, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { FieldErrors, useFieldArray, useFormContext } from 'react-hook-form';
import {
    validationError,
    ResourceType,
    resourceDropDownOptions,
} from '@/lib/utils';
import { Label } from '@/app/components/ui/label';
import Input from '@/app/components/common/Input';
import Select from '@/app/components/common/DropDown';
import { ErrorMessage } from '@hookform/error-message';
import VideoModal from './VideoModal';

interface Topic {
    resourceId: string;
    type: ResourceType;
    name: string;
    weightage: number;
}
interface DailyUpload {
    id: string;
    topics: Topic[];
    dayName: string;
    accessibleDay: string;
    topicName: { value: string }[];
}
interface Standard {
    id: string;
    name: string;
    description: string;
    dailyUploads: DailyUpload[];
    topicsDescriptions: { topicName: string; description: string }[];
}
interface FormValues {
    standard: Standard;
}

function CreateTopic({
    index,
    allSelectedResources,
    setAllSelectedResources,
    errors,
}: {
    index: number;
    allSelectedResources: {
        resourceId: string;
        resourceType: ResourceType;
        name: string;
        weightage: number;
    }[];
    setAllSelectedResources: (
        resources: {
            resourceId: string;
            resourceType: ResourceType;
            name: string;
            weightage: number;
        }[]
    ) => void;
    errors: FieldErrors<FormValues>;
}) {
    const { data } = useSession();
    const topicAddedRef = useRef(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isDisplayModal, setIsDisplayModal] = useState(false);
    const { control, watch, setValue } = useFormContext<FormValues>();

    const topicsDescriptions = watch('standard.topicsDescriptions');
    const topicOptions =
        topicsDescriptions?.length > 0
            ? topicsDescriptions.map((topic) => ({
                  label: topic.topicName,
                  value: topic.topicName,
              }))
            : [];

    const {
        fields: topicFields,
        append: appendTopic,
        remove: removeTopic,
    } = useFieldArray<FormValues>({
        control,
        name: `standard.dailyUploads.${index}.topics`,
    });

    const {
        fields: topicNameFields,
        append: appendTopicName,
        remove: removeTopicName,
    } = useFieldArray<FormValues>({
        control,
        name: `standard.dailyUploads.${index}.topicName`,
    });

    const handleOpenModal = (topicIndex: number) => {
        setSelectedIndex(topicIndex);
        setIsDisplayModal(true);
    };

    const handleCloseModal = () => {
        setIsDisplayModal(false);
    };

    useEffect(() => {
        if (!data) {
            return;
        }
        if (topicFields.length === 0 && !topicAddedRef.current) {
            appendTopic({
                resourceId: '',
                type: ResourceType.VIDEO,
                name: '',
                weightage: 0,
            });
            topicAddedRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (isDisplayModal) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isDisplayModal]);

    const handleResourceSelect = (topicIndex: number, resourceId: string) => {
        setValue(
            `standard.dailyUploads.${index}.topics.${topicIndex}.resourceId`,
            resourceId
        );
    };

    return (
        <>
            <div className="flex items-center justify-between my-4">
                <h3 className="text-xl font-semibold">Topic:</h3>
                <div
                    className="cursor-pointer border p-3 text-sm text-dark-gray rounded-lg hover:bg-slate-100 "
                    onClick={() => {
                        if (
                            allSelectedResources &&
                            allSelectedResources.length > 0 &&
                            allSelectedResources[topicFields.length - 1]
                                .resourceId === ''
                        ) {
                            toast.error(
                                'Please select a resource before adding a new one'
                            );
                            return;
                        }
                        appendTopic({
                            resourceId: '',
                            type: ResourceType.VIDEO,
                            name: '',
                            weightage: 0,
                        });
                        setAllSelectedResources([
                            ...(allSelectedResources || []),
                            {
                                resourceId: '',
                                resourceType: ResourceType.VIDEO,
                                name: '',
                                weightage: 0,
                            },
                        ]);
                    }}
                >
                    <button type="button">Add Resource</button>
                </div>
            </div>
            <div className="sm:flex justify-between items-center gap-5 w-full">
                <div className="basis-1/2 relative">
                    <Label
                        htmlFor={`standard.dailyUploads.${index}.accessibleDay`}
                    >
                        Access Day
                    </Label>
                    <Input
                        type="number"
                        placeholder="Enter Day Number"
                        name={`standard.dailyUploads.${index}.accessibleDay`}
                        additionalClasses="mobile:!w-full mt-1"
                        rules={{
                            required: {
                                value: true,
                                message: validationError.REQUIRED_FIELD,
                            },
                            min: {
                                value: 0,
                                message:
                                    'Day number must be greater than or equal to 0',
                            },
                        }}
                    />
                    <span className="text-red-500 text-xs">
                        <ErrorMessage
                            errors={errors}
                            name={`standard.dailyUploads.${index}.accessibleDay`}
                            render={({ message }) => (
                                <p className="flex items-center">
                                    <X size={20} color="#E6500D" />
                                    {message}
                                </p>
                            )}
                        />
                    </span>
                </div>
                <div className="basis-1/2 relative">
                    <Label htmlFor={`standard.dailyUploads.${index}.dayName`}>
                        Day Name
                    </Label>
                    <Input
                        type="text"
                        placeholder="Enter Name for the Day"
                        name={`standard.dailyUploads.${index}.dayName`}
                        additionalClasses="mobile:!w-full mt-1"
                        rules={{
                            required: {
                                value: true,
                                message: validationError.REQUIRED_FIELD,
                            },
                        }}
                    />
                    <span className="text-red-500 text-xs">
                        <ErrorMessage
                            errors={errors}
                            name={`standard.dailyUploads.${index}.dayName`}
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
            {topicFields.map((topic, topicIndex) => (
                <div key={topic.id}>
                    <div className="sm:flex justify-between items-center gap-5 w-full">
                        <div className="basis-full relative">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:mb-1 mb-2 mobile:flex-col mobile:items-start mobile:w-full">
                                <div className="w-full sm:w-1/2 md:!w-[38.5%]">
                                    <Label
                                        htmlFor={`standard.dailyUploads.${index}.topics.${topicIndex}.type`}
                                    >
                                        Type
                                    </Label>
                                    <Select
                                        additionalClasses="mobile:!w-full mt-1"
                                        name={`standard.dailyUploads.${index}.topics.${topicIndex}.type`}
                                        options={resourceDropDownOptions}
                                        selectedOption={ResourceType.VIDEO}
                                        disabled={
                                            watch(
                                                `standard.dailyUploads.${index}.topics.${topicIndex}.resourceId`
                                            ) !== ''
                                        }
                                    />
                                </div>
                                <div className="sm:w-28">
                                    {allSelectedResources[topicIndex].name ? (
                                        <div className="border text-sm text-dark-gray rounded-lg text-center px-3 pt-[0.68rem] pb-[0.68rem] flex gap-2 items-center">
                                            {allSelectedResources.length >
                                                topicIndex && (
                                                <>
                                                    <FileUpIcon />
                                                    {allSelectedResources[
                                                        topicIndex
                                                    ].name.slice(0, 5)}
                                                    {allSelectedResources[
                                                        topicIndex
                                                    ].name.length > 5 && '...'}
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            className="cursor-pointer border text-sm text-dark-gray rounded-lg text-center p-3 hover:bg-slate-100"
                                            onClick={() =>
                                                handleOpenModal(topicIndex)
                                            }
                                        >
                                            <button
                                                className="text-sm text-center"
                                                type="button"
                                            >
                                                Select
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full sm:w-1/2 md:!w-[38.5%]">
                                    <Label
                                        htmlFor={`standard.dailyUploads.${index}.topics.${topicIndex}.weightage`}
                                    >
                                        Weightage
                                    </Label>
                                    <Input
                                        additionalClasses="!my-0"
                                        type="number"
                                        placeholder="Enter Weightage"
                                        name={`standard.dailyUploads.${index}.topics.${topicIndex}.weightage`}
                                        rules={{
                                            required: {
                                                value: true,
                                                message:
                                                    validationError.REQUIRED_FIELD,
                                            },
                                            min: {
                                                value: 0,
                                                message:
                                                    'Weightage must be at least 0',
                                            },
                                            max: {
                                                value: 100,
                                                message:
                                                    'Weightage must not be more than 100',
                                            },
                                        }}
                                    />
                                    <span className="text-red-500 text-xs">
                                        <ErrorMessage
                                            errors={errors}
                                            name={`standard.dailyUploads.${index}.topics.${topicIndex}.weightage`}
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
                                <div
                                    className="cursor-pointer p-3 border text-center text-sm rounded-lg w-24 bg-red-500 text-gray-50 hover:bg-red-600"
                                    onClick={() => {
                                        // Remove the topic from allSelectedResources
                                        const updatedSelectedResources =
                                            allSelectedResources
                                                ? allSelectedResources.filter(
                                                      (_, idx) =>
                                                          idx !== topicIndex
                                                  )
                                                : [];
                                        setAllSelectedResources(
                                            updatedSelectedResources
                                        );

                                        // Remove the topic from the form
                                        removeTopic(topicIndex);
                                    }}
                                >
                                    <button type="button">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="fixed right-0 top-0 z-50 w-full md:w-[60%] lg:w-[30%]">
                        {isDisplayModal && (
                            <VideoModal
                                onClose={handleCloseModal}
                                resourceType={watch(
                                    `standard.dailyUploads.${index}.topics.${selectedIndex}.type`
                                )}
                                weightage={watch(
                                    `standard.dailyUploads.${index}.topics.${selectedIndex}.weightage`
                                )}
                                setAllSelectedResources={
                                    setAllSelectedResources
                                }
                                allSelectedResources={allSelectedResources}
                                selectedIndex={selectedIndex}
                                updateSelectedResource={(resourceId: string) =>
                                    handleResourceSelect(
                                        selectedIndex,
                                        resourceId
                                    )
                                }
                            />
                        )}
                    </div>
                </div>
            ))}
            {topicNameFields.map((field, topicNameIndex) => (
                <div key={field.id}>
                    <div className="sm:flex justify-between items-center gap-5 w-full">
                        <div className="basis-full relative">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:mb-1 mb-2 mobile:flex-col mobile:items-start mobile:w-full">
                                <div className="w-full md:!w-1/2">
                                    <Label
                                        htmlFor={`standard.dailyUploads.${index}.topicName`}
                                    >
                                        Topic Name
                                    </Label>
                                    <div className="flex flex-row">
                                        <Select
                                            additionalClasses="mobile:!w-full mt-1"
                                            name={`standard.dailyUploads.${index}.topicName.${topicNameIndex}.value`}
                                            options={topicOptions}
                                            selectedOption={
                                                topicOptions[0]?.value
                                            }
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message:
                                                        validationError.REQUIRED_FIELD,
                                                },
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="whitespace-nowrap cursor-pointer p-1 border text-center text-sm rounded-lg w-28 bg-red-500 text-gray-50 hover:bg-red-600 ml-2 h-12"
                                            onClick={() =>
                                                removeTopicName(topicNameIndex)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <span className="text-red-500 text-xs">
                                        <ErrorMessage
                                            errors={errors}
                                            name={`standard.dailyUploads.${index}.topicName.${topicNameIndex}.value`}
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
                            </div>
                        </div>
                    </div>

                    <div className="fixed right-0 top-0 z-50 w-full md:w-[60%] lg:w-[30%]">
                        {isDisplayModal && (
                            <VideoModal
                                onClose={handleCloseModal}
                                resourceType={watch(
                                    `standard.dailyUploads.${index}.topics.${selectedIndex}.type`
                                )}
                                weightage={watch(
                                    `standard.dailyUploads.${index}.topics.${selectedIndex}.weightage`
                                )}
                                setAllSelectedResources={
                                    setAllSelectedResources
                                }
                                allSelectedResources={allSelectedResources}
                                selectedIndex={selectedIndex}
                                updateSelectedResource={(resourceId: string) =>
                                    handleResourceSelect(
                                        selectedIndex,
                                        resourceId
                                    )
                                }
                            />
                        )}
                    </div>
                </div>
            ))}
            <button
                type="button"
                className="cursor-pointer border p-3 mt-1 text-sm text-dark-gray rounded-lg hover:bg-slate-100 "
                onClick={() =>
                    appendTopicName({ value: topicOptions[0]?.value ?? '' })
                }
            >
                Add Topic
            </button>
            <hr className="my-5" />
        </>
    );
}

export default CreateTopic;
