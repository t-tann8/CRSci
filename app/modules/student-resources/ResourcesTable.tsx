'use client';

import React, { useEffect, useState } from 'react';
import { Poppins } from 'next/font/google';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import ResourceDownloadModal from './ResourceDownloadModal';

export interface ResourcesInterface {
    topic: string;
    id: number;
    assignedResources: string;
}

export interface ResourcesProp {
    resources: ResourcesInterface[];
    fontSize?: string;
}

type Resource = {
    id: string;
    name: string;
    type: string;
    topic: string;
    url: string;
    released: boolean;
};

type Standard = {
    id: string;
    name: string;
    resourceCount: number;
    resources: Resource[];
};

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});
function ResourcesTable({ standards }: { standards: Standard[] }) {
    const [isShowDownloadModal, setIsShowDownloadModal] = useState(false);
    const [selectedStandard, setSelectedStandard] = useState<Standard | null>(
        null
    );

    const handleOpenDownloadModal = (standard: Standard) => {
        setSelectedStandard(standard);
        setIsShowDownloadModal(true);
    };

    const handleCloseDownloadModal = () => {
        setIsShowDownloadModal(false);
        setSelectedStandard(null);
    };

    useEffect(() => {
        if (isShowDownloadModal) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isShowDownloadModal]);

    return (
        <section>
            <Table
                className={`text-['18']px] mobile:text-sm whitespace-nowrap ${poppins.className}`}
            >
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-dark-gray font-bold">
                            SNO.
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold">
                            Standard
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold">
                            Assigned Resource
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                {standards.length === 0 ? (
                    <TableBody>
                        <TableRow>
                            <TableCell
                                className="text-center py-12"
                                colSpan={4}
                            >
                                No Assignment found!
                            </TableCell>
                        </TableRow>
                    </TableBody>
                ) : (
                    <TableBody>
                        {standards?.map((standard, index) => (
                            <TableRow className="border-none" key={standard.id}>
                                <TableCell className="font-medium">
                                    <span className="bg-light-gray rounded-md">
                                        {index + 1}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span>{standard.name}</span>
                                </TableCell>

                                <TableCell className="text-dark-gray">
                                    {standard.resourceCount}
                                </TableCell>

                                <TableCell>
                                    <button
                                        type="button"
                                        className="border rounded-lg px-4 py-2 text-dark-gray hover:bg-primary-color hover:text-white transition-colors duration-300 ease-in-out"
                                        onClick={() =>
                                            handleOpenDownloadModal(standard)
                                        }
                                    >
                                        Download
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>
            {isShowDownloadModal && (
                <div className="fixed right-0 top-0 z-50 lg:w-[30%] w-full md:w-[60%]">
                    <ResourceDownloadModal
                        onClose={handleCloseDownloadModal}
                        standard={selectedStandard!}
                    />
                </div>
            )}
        </section>
    );
}
export default ResourcesTable;
