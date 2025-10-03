'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { FileTypeIcon, FileVideoIcon } from 'lucide-react';
import ModalFooter from '@/app/components/common/ModalFooter';
import { ModalHeader } from '@/app/components/common/ModalHeader';
import SearchInput from '@/app/components/common/SearchInput';
import {
    getResourcesByNameAPI,
    getResourcesByTypeAPI,
} from '@/app/api/resource';
import { ResourceType } from '@/lib/utils';
import QuizCard from '@/app/components/common/QuizCard';
import PageLoader from '@/app/components/common/PageLoader';

function VideoModal({
    onClose,
    resourceType,
    weightage,
    allSelectedResources,
    setAllSelectedResources,
    selectedIndex,
    updateSelectedResource,
}: {
    onClose: () => void;
    resourceType: ResourceType;
    weightage: number;
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
    selectedIndex: number;
    updateSelectedResource: (resourceId: string) => void;
}) {
    const { data } = useSession();
    const [allResources, setAllResources] = useState<
        {
            id: string;
            name: string;
            url: string;
            type: ResourceType;
            thumbnail?: string;
        }[]
    >([]);
    const [resourceCards, setResourceCards] = useState<
        { id: string; Text: string; imageUrl: string }[]
    >([]);
    const [selectedResource, setSelectedResource] = useState({
        resourceId: allSelectedResources[selectedIndex].resourceId ?? '',
        resourceType,
        name: allSelectedResources[selectedIndex].name ?? '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const convertResourceToCard = (
        rawResources: {
            id: string;
            name: string;
            url: string;
            type: ResourceType;
            thumbnail?: string;
        }[]
    ) => {
        const transformedData = rawResources.map((resource) => {
            if (resource.type === ResourceType.VIDEO) {
                return {
                    id: resource.id,
                    imageUrl: resource.thumbnail!,
                    Text: resource.name,
                };
            }
            return {
                id: resource.id,
                imageUrl: resource.url,
                Text: resource.name,
            };
        });

        setResourceCards(transformedData);
    };

    const searchResources = useCallback(
        async (searchInput: string) => {
            if (!data) {
                return;
            }
            if (searchInput === '') {
                convertResourceToCard(allResources);
                return;
            }

            try {
                const APIData = await getResourcesByNameAPI({
                    accessToken: data?.user?.accessToken,
                    resourceType,
                    resourceName: searchInput,
                });

                if (!APIData.ok) {
                    const errorData = await APIData.json();
                    throw new Error(
                        errorData?.message ??
                            'An error occurred while fetching video data'
                    );
                }

                const responseData = await APIData.json();
                const searchedResources = responseData?.data;
                convertResourceToCard(searchedResources);
            } catch (error: any) {
                toast.error(
                    error.message ??
                        'An error occurred while searching resources'
                );
            }
        },
        [allResources, data, resourceType]
    );

    useEffect(() => {
        if (!data) {
            return;
        }

        setSelectedResource({
            ...selectedResource,
            resourceType,
        });

        const getResourcesByType = async () => {
            try {
                setIsLoading(true);
                const APIData = await getResourcesByTypeAPI({
                    accessToken: data?.user?.accessToken,
                    resourceType,
                });

                if (!APIData.ok) {
                    const errorData = await APIData.json();
                    throw new Error(
                        errorData?.message ??
                            'An error occurred while fetching video data'
                    );
                }

                const responseData = await APIData.json();
                const allFetchedResources = responseData?.data;
                setAllResources(allFetchedResources);
                convertResourceToCard(allFetchedResources);
            } catch (error: any) {
                toast.error(
                    error.message ??
                        'An error occurred while fetching video data'
                );
            } finally {
                setIsLoading(false);
            }
        };

        getResourcesByType();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resourceType]);

    return (
        <section className="bg-white h-screen p-4 shadow-md overflow-y-auto">
            <ModalHeader
                headerText={{
                    heading: `Select ${
                        resourceType.charAt(0).toUpperCase() +
                        resourceType.slice(1)
                    }`,
                    tagline: `Select ${resourceType} For your plan`,
                }}
                Icon={
                    resourceType === ResourceType.VIDEO
                        ? FileVideoIcon
                        : FileTypeIcon
                }
                onClose={onClose}
            />
            <div className="mb-5">
                <SearchInput handleChange={searchResources} />
            </div>
            {isLoading ? (
                <PageLoader additionalClasses="!h-2/3" />
            ) : (
                <div className="px-6 mb-24">
                    {resourceCards.length === 0 ? (
                        <div className="grid justify-items-center text-lg">
                            No resource found
                        </div>
                    ) : (
                        resourceCards.map((card) => (
                            <div className="mt-5" key={card.id}>
                                <QuizCard
                                    card={card}
                                    selectedResource={selectedResource}
                                    setSelectResource={(id: string) => {
                                        setSelectedResource({
                                            ...selectedResource,
                                            resourceId: id,
                                            name: card.Text,
                                        });
                                        updateSelectedResource(id);
                                    }}
                                />
                            </div>
                        ))
                    )}
                </div>
            )}

            <div
                onClick={() => {
                    setAllSelectedResources(
                        allSelectedResources.map((resource, index) => {
                            if (index === selectedIndex) {
                                return {
                                    ...selectedResource,
                                    weightage,
                                };
                            }
                            return resource;
                        })
                    );
                    setSelectedResource({
                        resourceId: '',
                        resourceType,
                        name: '',
                    });
                    onClose();
                }}
            >
                <ModalFooter text="Continue" />
            </div>
        </section>
    );
}

export default VideoModal;
