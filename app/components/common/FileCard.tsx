'use client';

import React from 'react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import PptIcon from '@/app/assets/icons/PptIcon';
import XlsIcon from '@/app/assets/icons/XlsIcon';
import { ResourceType } from '@/lib/utils';

export interface FileInterface {
    id: string;
    imageUrl: string | StaticImport;
    resourceType: string;
    name: string;
    btnText: string;
}

interface FileCardProp {
    card: FileInterface;
    released: boolean;
    handleDownload: ({ url, name }: { url: string; name: string }) => void;
}

function FileCard({ card, released, handleDownload }: FileCardProp) {
    let resourceRenderingLink = '';

    if (
        card?.resourceType === ResourceType.SLIDESHOW ||
        card?.resourceType === ResourceType.ASSIGNMENT ||
        card?.resourceType === ResourceType.QUIZ ||
        card?.resourceType === ResourceType.WORKSHEET ||
        card?.resourceType === ResourceType.SUMMARIZE_ASSESSMENT ||
        card?.resourceType === ResourceType.FORMATIVE_ASSESSMENT
    ) {
        resourceRenderingLink = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            card?.imageUrl as string
        )}`;
    } else {
        resourceRenderingLink = card?.imageUrl?.toString() as string;
    }

    return (
        <div className=" bg-white border rounded-lg shadow flex flex-col justify-center md:p-4 mobile:p-2 ">
            <div className="relative">
                <iframe
                    src={resourceRenderingLink}
                    title="Thumbnail Viewer"
                    className="w-full"
                    style={{ width: '100%', height: '100%' }}
                />
                <div className="bg-sky-400 w-fit p-2 absolute left-3 top-3 z-10 rounded-lg">
                    {card.resourceType === 'ppt' && <PptIcon />}
                    {card.resourceType === 'xls' && <XlsIcon />}
                </div>
            </div>
            <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 mt-5">
                {card.name}
            </h5>
            <div
                className="flex justify-end px-4 cursor-pointer"
                onClick={() => {
                    if (!released) {
                        return null;
                    }
                    return handleDownload({
                        url: card.imageUrl as string,
                        name: card.name,
                    });
                }}
            >
                <p
                    className={`p-3 w-fit rounded-lg hover:bg-orange-500
                        ${
                            !released
                                ? 'bg-gray-300 text-white'
                                : 'bg-primary-color text-white'
                        }`}
                >
                    {card.btnText}
                </p>
            </div>
        </div>
    );
}

export default FileCard;
