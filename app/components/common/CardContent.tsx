'use client';

import Link from 'next/link';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { EditIcon, LucideIcon, Trash } from 'lucide-react';
import action from '@/app/action';
import { deleteVideoAPI } from '@/app/api/video';
import { deleteStandard } from '@/app/api/standard';
import DialogBox from './DialogBox';

export interface IconProps {
    FirstIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
    SecondIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
    ThirdIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
}

interface CardContentProps {
    id: string | undefined;
    route?: string;
    heading: string;
    first?: string;
    second?: string;
    third?: string;
    Icons: IconProps;
    isModal?: boolean;
    isHideEditIcon?: boolean;
    isFromStandard?: boolean;
    isShownFromStudent?: boolean;
    handleOpenEditModal?: (id: string) => void;
}

function CardContent({
    id,
    route,
    heading,
    first,
    second,
    third,
    Icons,
    isModal,
    isHideEditIcon,
    isShownFromStudent,
    isFromStandard,
    handleOpenEditModal,
}: CardContentProps) {
    const { FirstIcon, SecondIcon, ThirdIcon } = Icons;
    const path = usePathname();
    const { data } = useSession();
    const [isShowDialogBox, setIsShowDialogBox] = useState(false);

    useEffect(() => {
        if (!data) {
            return;
        }
        if (isShowDialogBox) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        // eslint-disable-next-line consistent-return
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isShowDialogBox, data]);

    const handleConfirmDelete = async () => {
        try {
            const result = path.includes('/admin/video')
                ? await deleteVideoAPI({
                      videoId: id || '',
                      accessToken: data?.user?.accessToken || '',
                  })
                : await deleteStandard(data?.user?.accessToken || '', id || '');
            if (result?.status === 200) {
                if (path.includes('/admin/video')) {
                    toast.success('Video Deleted Successfully');
                    action('getAllVideos');
                } else {
                    toast.success('Standard Deleted Successfully');
                    action('getAllSummarizedStandards');
                }
            }
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    'An error occurred during deletion'
            );
        }
    };

    const handleCancelDelete = () => {
        setIsShowDialogBox(false);
    };
    return (
        <div className="mt-2">
            <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900">
                {heading}
            </h5>
            <div>
                <div className="flex gap-2 mb-2">
                    {first && (
                        <div className="flex gap-1 items-center text-dark-gray text-sm">
                            <FirstIcon height={17} width={17} color="#F59A3B" />
                            <p>{first}</p>
                        </div>
                    )}
                    {second && (
                        <div className="flex gap-1 items-center text-dark-gray text-sm">
                            <SecondIcon
                                width={17}
                                height={17}
                                color="#7AA43E"
                            />
                            <p>{second}</p>
                        </div>
                    )}
                </div>
                {third && (
                    <div className="flex gap-1 items-center mb-5 text-dark-gray text-sm">
                        <ThirdIcon height={17} width={17} color="#54C3F4" />
                        <p>{third}</p>
                    </div>
                )}
            </div>
            {isModal ? (
                <Link
                    href={route && id ? `${route}/${id}` : '#'}
                    className="border rounded-lg text-white px-3 py-2 text-sm font-medium text-center mr-2 float-right bg-primary-color"
                >
                    Selected
                </Link>
            ) : (
                <div className="flex items-end justify-end mt-7 lg:mt-5 gap-2">
                    <Link
                        href={route && id ? `${route}/${id}` : '#'}
                        className="border rounded-lg text-dark-gray px-3 py-2 text-sm font-medium text-center lg:hover:bg-primary-color lg:hover:text-white"
                    >
                        {isShownFromStudent ? 'Start Course' : 'Details'}
                    </Link>
                    {!isHideEditIcon && (
                        <>
                            <div className="bg-orange-100 p-2 rounded-md cursor-pointer">
                                <Link
                                    href={
                                        isFromStandard && route && id
                                            ? `${route}/edit/${id}`
                                            : '#'
                                    }
                                >
                                    <EditIcon
                                        height={20}
                                        width={20}
                                        color="#F59A3B"
                                        onClick={() =>
                                            handleOpenEditModal &&
                                            handleOpenEditModal(id ?? '')
                                        }
                                    />
                                </Link>
                            </div>
                            <div
                                className="bg-red-100 p-2 rounded-md cursor-pointer"
                                onClick={() => setIsShowDialogBox(true)}
                            >
                                <Trash color="#D34645" width={18} height={18} />
                            </div>
                        </>
                    )}
                </div>
            )}
            {isShowDialogBox && (
                <DialogBox
                    isOpen={isShowDialogBox}
                    message={`Are you sure you want to delete ${
                        heading || 'this standard'
                    }?`}
                    onYes={handleConfirmDelete}
                    onNo={handleCancelDelete}
                />
            )}
        </div>
    );
}

export default CardContent;
