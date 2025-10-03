'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import PptIcon from '@/app/assets/icons/PptIcon';
import XlsIcon from '@/app/assets/icons/XlsIcon';

interface FileCardProps {
    id: string;
    imageUrl: string | StaticImport;
    resourceType: string;
    text: string;
}

function FileCard({ id, imageUrl, resourceType, text }: FileCardProps) {
    return (
        <div className=" h-full">
            <div className="relative">
                <Image
                    src={imageUrl}
                    alt="resource"
                    className="w-full h-full "
                />
                <div className="bg-sky-400 w-fit p-2 absolute left-3 top-3 z-10 rounded-lg">
                    {resourceType.toLowerCase() === 'slideshow' && <PptIcon />}
                    {resourceType.toLowerCase() === 'worksheet' && <XlsIcon />}
                    {resourceType.toLowerCase() !== 'slideshow' &&
                        resourceType.toLowerCase() !== 'worksheet' && (
                            <HelpCircle color="white" />
                        )}
                </div>
            </div>
            <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 mt-5">
                {text}
            </h5>
        </div>
    );
}

export default FileCard;
