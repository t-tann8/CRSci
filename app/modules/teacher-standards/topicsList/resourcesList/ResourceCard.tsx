'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EditIcon, PlayIcon } from 'lucide-react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import QuestionIcon from '@/app/assets/icons/QuestionIcon';
import ResourceIcon from '@/app/assets/icons/ResourceIcon';
import CheckPointIcon from '@/app/assets/icons/CheckPointIcon';
import CardContent, { IconProps } from '@/app/components/common/CardContent';
import VideoCard from './VideoCard';
import FileCard from './FileCard';

export interface ResourceCardInterface {
    id: string;
    imageUrl: string | StaticImport;
    resourceType: string;
    isSelected: boolean;
    Text: string;
    Questions: number;
    Checkpoints: number;
    Resources: number;
}

interface ResourceCardProp {
    card: ResourceCardInterface;
}

function ResourceCard({ card }: ResourceCardProp) {
    const Icons: IconProps = {
        FirstIcon: QuestionIcon,
        SecondIcon: CheckPointIcon,
        ThirdIcon: ResourceIcon,
    };
    return (
        <div className=" bg-white border rounded-lg shadow flex flex-col justify-center md:p-4 mobile:p-2 ">
            {card.resourceType === 'video' ? (
                <VideoCard
                    id={card.Questions.toString()}
                    heading={card.Text}
                    first={`Questions (${card.Questions})`}
                    second={`Checkpoints (${card.Checkpoints})`}
                    third={`Resources (${card.Resources})`}
                    Icons={Icons}
                    imageUrl={card.imageUrl}
                />
            ) : (
                <FileCard
                    id={card.id}
                    imageUrl={card.imageUrl}
                    resourceType={card.resourceType}
                    text={card.Text}
                />
            )}

            <div className="flex items-end justify-end">
                <button
                    type="button"
                    // href={route && id ? `${route}/${id}` : '#'}
                    className={`border rounded-lg text-dark-gray px-3 py-2 text-sm font-medium text-center mr-2 lg:hover:bg-primary-color lg:hover:text-white ${
                        card.isSelected && 'bg-primary-color text-white'
                    }`}
                >
                    {card.isSelected ? 'Selected' : 'Select'}
                </button>
                {card.isSelected && (
                    <div className="bg-orange-100 p-2 rounded-lg mt-4">
                        <EditIcon height={20} width={20} color="#F59A3B" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResourceCard;
