import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import {
    Activity,
    BookAIcon,
    Database,
    Eye,
    FileTerminal,
    FileType2,
    LayoutList,
    ScrollText,
    Trash,
} from 'lucide-react';
import { Poppins } from 'next/font/google';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import action from '@/app/action';
import XlsIcon from '@/app/assets/icons/XlsIcon';
import PptIcon from '@/app/assets/icons/PptIcon';
import EditIcon from '@/app/assets/icons/EditIcon';
import { deleteResourceAPI } from '@/app/api/resource';
import TicketIcon from '@/app/assets/icons/TicketIcon';
import DialogBox from '@/app/components/common/DialogBox';
import RecorderIcon from '@/app/assets/icons/RecorderIcon';
import QuestionMarkIcon from '@/app/assets/icons/QuestionMarkIcon';
import UpdateResourceModal from '@/app/modules/resources/UpdateResourceModal';
import { DEFAULT_RESOURCE, Resource, ResourceType } from '@/lib/utils';
import AssignmentIcon from '@/app/assets/icons/AssignmentIcon';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '../ui/table';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});

function CommonTable({
    resources,
    resourcesType,
    currentPage = 0,
    limit = 0,
    handlePageChange,
}: {
    resources: Resource[];
    resourcesType?: string;
    currentPage?: number;
    limit?: number;
    handlePageChange?: (page: number) => void;
}) {
    const { push } = useRouter();
    const { data } = useSession();
    const pathname = usePathname();
    const [isShowDialogBox, setIsShowDialogBox] = useState(false);
    const [showUploadResourceModal, setShowUploadResourceModal] =
        useState(false);
    const [selectedResource, setSelectedResource] =
        useState<Resource>(DEFAULT_RESOURCE);

    const handleDeleteResources = async (idToRemove: string) => {
        if (data?.user?.accessToken) {
            try {
                await deleteResourceAPI({
                    accessToken: data?.user?.accessToken,
                    resourceId: idToRemove,
                });
                if (resources?.length === 1 && currentPage >= 1) {
                    handlePageChange && handlePageChange(currentPage);
                } else {
                    action('getResources');
                }
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message || 'An Error Occured'
                );
            }
        }
    };

    const handleConfirmDelete = async () => {
        await handleDeleteResources(selectedResource?.id);
        toast.success('Resource deleted successfully');
        setIsShowDialogBox(false);
    };

    const handleCancelDelete = () => {
        setIsShowDialogBox(false);
    };

    useEffect(() => {
        if (showUploadResourceModal || isShowDialogBox) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [showUploadResourceModal, isShowDialogBox]);

    return (
        <>
            <Table className={`text-md mobile:text-sm ${poppins.className}`}>
                <TableHeader>
                    <TableRow>
                        <TableHead className=" text-dark-gray font-bold w-1/5">
                            SNO.
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold w-1/3">
                            Title
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold w-1/3">
                            Assign Topic
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold w-1/5">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                {resources.length > 0 ? (
                    <TableBody>
                        {resources.map((resource, index) => (
                            <TableRow className="border-none" key={resource.id}>
                                <TableCell className="font-medium">
                                    <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                        {currentPage * limit + index + 1}
                                    </span>
                                </TableCell>
                                <TableCell className="flex space-x-2 items-center">
                                    {resourcesType?.toLowerCase() ===
                                        'slideshows' && (
                                        <PptIcon fill="#1ebeff" />
                                    )}
                                    {resourcesType?.toLowerCase() ===
                                        'total-videos' && <RecorderIcon />}
                                    {resourcesType?.toLowerCase() ===
                                        'worksheets' && (
                                        <XlsIcon color="#54C3F4" />
                                    )}
                                    {resourcesType?.toLowerCase() ===
                                        'quizzes' && <QuestionMarkIcon />}
                                    {resourcesType?.toLowerCase() ===
                                        'assignments' && <AssignmentIcon />}
                                    {resourcesType?.toLowerCase() ===
                                        'labs' && (
                                        <ScrollText color="#F02070" />
                                    )}
                                    {resourcesType?.toLowerCase() ===
                                        'stations' && (
                                        <LayoutList color="#F59A3B" />
                                    )}
                                    {resourcesType?.toLowerCase() ===
                                        'activities' && (
                                        <Activity color="#7D0DC3" />
                                    )}
                                    {resourcesType?.toLowerCase() ===
                                        'guided-notes' && (
                                        <BookAIcon color="#F0A020" />
                                    )}
                                    {resourcesType?.toLowerCase() ===
                                        'formative-assessments' && (
                                        <FileType2 color="#7D0DC3" />
                                    )}
                                    {resourcesType?.toLowerCase() ===
                                        'summarize-assessments' && (
                                        <FileTerminal />
                                    )}
                                    {resourcesType?.toLowerCase() ===
                                        'data-trackers' && (
                                        <Database color="#F02070" />
                                    )}

                                    <span>{resource.name}</span>
                                </TableCell>
                                <TableCell className="text-dark-gray">
                                    {resource.topic}
                                </TableCell>
                                <TableCell className="flex justify-start items-center p-0 mt-3 ml-3 gap-2">
                                    <div
                                        className="bg-light-orange p-1 rounded-md cursor-pointer"
                                        onClick={() => {
                                            if (
                                                resource.type ===
                                                ResourceType.VIDEO
                                            ) {
                                                return push(
                                                    `/admin/video/${resource.videoId}`
                                                );
                                            }
                                            return push(
                                                `${pathname}/${resource.id}`
                                            );
                                        }}
                                    >
                                        <Eye
                                            color="#F59A3B"
                                            width={18}
                                            height={18}
                                        />
                                    </div>
                                    <EditIcon
                                        width={28}
                                        height={28}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setSelectedResource(resource);
                                            setShowUploadResourceModal(true);
                                        }}
                                    />
                                    <div
                                        className="bg-red-100 rounded-md p-1 cursor-pointer"
                                        onClick={() => {
                                            setSelectedResource(resource);
                                            setIsShowDialogBox(true);
                                        }}
                                    >
                                        <Trash
                                            color="#D34645"
                                            width={18}
                                            height={18}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                ) : (
                    <TableBody>
                        <TableRow>
                            <TableCell
                                className="text-center py-12"
                                colSpan={4}
                            >
                                No Entries found
                            </TableCell>
                        </TableRow>
                    </TableBody>
                )}
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
            {showUploadResourceModal && (
                <div className="fixed right-0 top-0 z-50 w-[100%] md:w-[60%] lg:w-[30%]">
                    <UpdateResourceModal
                        onClose={() => {
                            setShowUploadResourceModal(false);
                            setSelectedResource(DEFAULT_RESOURCE);
                        }}
                        resource={selectedResource}
                    />
                </div>
            )}
        </>
    );
}

export default CommonTable;
