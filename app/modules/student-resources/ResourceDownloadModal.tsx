import React from 'react';
import { handleDownload } from '@/lib/utils';
import FileCard from '@/app/components/common/FileCard';
import { ModalHeader } from '../../components/common/ModalHeader';

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

function ResourceDownloadModal({
    onClose,
    standard,
}: {
    onClose: () => void;
    standard: Standard;
}) {
    const handleDownloadAll = () => {
        standard.resources.forEach((resource) => {
            if (!resource.released) {
                return null;
            }
            return handleDownload({ url: resource.url, name: resource.name });
        });
    };

    return (
        <section className="w-full bg-white h-screen py-4 shadow-lg">
            <div className="h-[100%] overflow-y-auto px-6">
                <ModalHeader
                    headerText={{
                        heading: standard.name,
                        tagline: 'Assigned Resources to Standard',
                    }}
                    onClose={onClose}
                />
                <div
                    className="flex justify-end px-4"
                    onClick={handleDownloadAll}
                >
                    <p className="px-3 py-[0.7rem] bg-primary-color rounded-lg text-white w-fit cursor-pointer hover:bg-orange-500">
                        Download All
                    </p>
                </div>
                <div className="flex flex-col space-y-7 mt-7">
                    {standard?.resources?.map((resource) => (
                        <FileCard
                            key={resource.id}
                            handleDownload={handleDownload}
                            released={resource.released}
                            card={{
                                id: resource.id,
                                imageUrl: resource.url,
                                resourceType: resource.type,
                                name: resource.name,
                                btnText: 'Download',
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ResourceDownloadModal;
