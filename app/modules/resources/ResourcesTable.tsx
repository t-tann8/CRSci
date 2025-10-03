'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Eye, Trash } from 'lucide-react';
import { Poppins } from 'next/font/google';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import action from '@/app/action';
import { deleteResourceAPI } from '@/app/api/resource';
import DialogBox from '@/app/components/common/DialogBox';
import {
    Resource,
    DEFAULT_RESOURCE,
    convertSpacesToDashes,
    ResourceToPath,
    ResourceType,
    capitalizeWords,
} from '@/lib/utils';

interface ResourcesProp {
    resources: Resource[];
    fontSize?: string;
    currentPage?: number;
    limit?: number;
    handlePageChange?: (page: number) => void;
    isDashboard?: boolean;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});
function ResourcesTable({
    resources,
    fontSize,
    currentPage = 0,
    limit = 0,
    handlePageChange,
    isDashboard,
}: ResourcesProp) {
    const path = usePathname();
    const { push } = useRouter();
    const { data } = useSession();
    const [isShowDialogBox, setIsShowDialogBox] = useState(false);
    const [selectedResource, setSelectedResource] =
        useState<Resource>(DEFAULT_RESOURCE);

    useEffect(() => {
        if (isShowDialogBox) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isShowDialogBox]);

    const handleClick = (
        event: React.MouseEvent<HTMLTableCellElement, MouseEvent>
    ) => {
        const topicName = event.currentTarget.textContent;

        if (topicName) {
            const formattedTopicName = convertSpacesToDashes(topicName);
            const newPath = `${path}/${formattedTopicName.toLowerCase()}`;
            push(newPath);
        }
    };

    const handleDeleteResources = async (idToRemove: string) => {
        if (data?.user?.accessToken) {
            try {
                const response = await deleteResourceAPI({
                    accessToken: data?.user?.accessToken,
                    resourceId: idToRemove,
                });
                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(
                        errorResponse.message || 'Failed to delete resource'
                    );
                }

                toast.success('Resource deleted successfully');

                if (resources?.length === 1 && currentPage >= 1) {
                    handlePageChange && handlePageChange(currentPage);
                } else {
                    action('getResources');
                }
            } catch (error: any) {
                toast.error(error.message || 'An Error Occured');
            }
        }
    };

    const handleConfirmDelete = async () => {
        await handleDeleteResources(selectedResource?.id);
        setIsShowDialogBox(false);
    };

    const handleCancelDelete = () => {
        setIsShowDialogBox(false);
    };

    return (
        <>
            <Table
                className={`text-[${fontSize || '18'}px] mobile:text-sm ${
                    poppins.className
                }`}
            >
                <TableHeader className="whitespace-nowrap">
                    <TableRow>
                        <TableHead className=" text-dark-gray font-bold">
                            SNO.
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold">
                            Resource Name
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold">
                            Resource Type
                        </TableHead>
                        {!isDashboard && (
                            <TableHead className="text-dark-gray font-bold">
                                Assign Topic{' '}
                            </TableHead>
                        )}
                        <TableHead className="text-dark-gray font-bold">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources?.length > 0 ? (
                        resources
                            .map((resource: Resource, index: number) => (
                                <TableRow
                                    className="border-none"
                                    key={resource.id}
                                >
                                    <TableCell className="font-medium ">
                                        <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                            {currentPage * limit + index + 1}
                                        </span>
                                    </TableCell>
                                    <TableCell className="">
                                        <span className="flex gap-x-2 items-center ">
                                            <span className="truncate h-[26px]">
                                                {resource.name}
                                            </span>
                                        </span>
                                    </TableCell>
                                    {/* <TableCell>{resource.name}</TableCell> */}
                                    <TableCell className="text-dark-gray">
                                        {capitalizeWords(resource.type)}
                                    </TableCell>
                                    {!isDashboard && (
                                        <TableCell
                                            className="text-dark-gray cursor-pointer lg:hover:text-gray-700 lg:hover:underline"
                                            onClick={(
                                                e: React.MouseEvent<
                                                    HTMLTableCellElement,
                                                    MouseEvent
                                                >
                                            ) => handleClick(e)}
                                        >
                                            {resource.topic}
                                        </TableCell>
                                    )}
                                    <TableCell className="flex justify-start items-center p-0 mt-3 ml-3">
                                        <div className="mr-2 bg-light-orange rounded-md p-1 cursor-pointer">
                                            <Eye
                                                color="#F59A3B"
                                                width={18}
                                                height={18}
                                                onClick={() => {
                                                    if (isDashboard) {
                                                        if (
                                                            resource.type ===
                                                            ResourceType.VIDEO
                                                        ) {
                                                            return push(
                                                                `${path}/video/${resource.videoId}`
                                                            );
                                                        }
                                                        return push(
                                                            `${path}/resources/${convertSpacesToDashes(
                                                                resource.topic
                                                            )}/${
                                                                ResourceToPath[
                                                                    resource.type as keyof typeof ResourceToPath
                                                                ]
                                                            }/${resource.id}`
                                                        );
                                                    }
                                                    if (
                                                        resource.type ===
                                                        ResourceType.VIDEO
                                                    ) {
                                                        return push(
                                                            `/admin/video/${resource.videoId}`
                                                        );
                                                    }
                                                    return push(
                                                        `${path}/${convertSpacesToDashes(
                                                            resource.topic
                                                        )}/${
                                                            ResourceToPath[
                                                                resource.type as keyof typeof ResourceToPath
                                                            ]
                                                        }/${resource.id}`
                                                    );
                                                }}
                                            />
                                        </div>
                                        {!isDashboard && (
                                            <div
                                                className="bg-red-100 rounded-md p-1 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedResource(
                                                        resource
                                                    );
                                                    setIsShowDialogBox(true);
                                                }}
                                            >
                                                <Trash
                                                    color="#D34645"
                                                    width={18}
                                                    height={18}
                                                />
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                            .slice(0, isDashboard ? 4 : resources.length)
                    ) : (
                        <TableRow>
                            <TableCell className="text-center" colSpan={5}>
                                No resources found!
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {isShowDialogBox && (
                <DialogBox
                    isOpen={isShowDialogBox}
                    message={`Are you sure you want to delete ${
                        selectedResource?.name || 'this resource'
                    }?`}
                    onYes={handleConfirmDelete}
                    onNo={handleCancelDelete}
                />
            )}
        </>
    );
}
export default ResourcesTable;
