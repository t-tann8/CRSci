import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { HelpCircle } from 'lucide-react';
import { ResourceType } from '@/lib/utils';

export interface Card {
    id: string;
    imageUrl: string | StaticImport;
    Text: string;
}

interface VideoCardProps {
    card: Card;
    selectedResource?: { resourceId: string; resourceType: ResourceType };
    setSelectResource?: (id: string) => void;
}

function VideoCard({
    card,
    selectedResource,
    setSelectResource,
}: VideoCardProps) {
    let resourceRenderingLink = '';
    if (selectedResource?.resourceType === ResourceType.SLIDESHOW) {
        resourceRenderingLink = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            card?.imageUrl?.toString()
        )}`;
    } else if (
        selectedResource?.resourceType === ResourceType.ASSIGNMENT ||
        selectedResource?.resourceType === ResourceType.QUIZ ||
        selectedResource?.resourceType === ResourceType.WORKSHEET ||
        selectedResource?.resourceType === ResourceType.SUMMARIZE_ASSESSMENT ||
        selectedResource?.resourceType === ResourceType.FORMATIVE_ASSESSMENT
    ) {
        resourceRenderingLink = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            card?.imageUrl as string
        )}`;
    } else {
        resourceRenderingLink = card?.imageUrl?.toString() as string;
    }
    return (
        <div className=" bg-white border rounded-lg shadow flex flex-col justify-center md:p-4 mobile:p-2">
            <Link href="#" className="relative ">
                <iframe
                    src={resourceRenderingLink}
                    title="Thumbnail Viewer"
                    className="w-full"
                    style={{ width: '100%', height: '100%' }}
                />

                <div className="absolute left-3 top-3 transform -translate-x-1/2 -translate-y-1/2">
                    <HelpCircle fill="#54C3F4" color="white" size={35} />
                </div>
            </Link>
            <div className="mt-2">
                <h5 className="mb-2 text-md font-semibold tracking-tight text-gray-900">
                    {card.Text}
                </h5>
                <Link
                    href="#"
                    className={
                        card.id === selectedResource?.resourceId
                            ? 'border rounded-lg text-white px-3 py-2 text-sm font-medium text-center mr-2 float-right bg-primary-color'
                            : 'bg-gray-400 "border rounded-lg text-white px-3 py-2 text-sm font-medium text-center mr-2 float-right '
                    }
                    onClick={() => {
                        if (setSelectResource) {
                            setSelectResource(card.id);
                        }
                    }}
                >
                    {card.id === selectedResource?.resourceId
                        ? 'Selected'
                        : 'Select'}
                </Link>
            </div>
        </div>
    );
}

export default VideoCard;
