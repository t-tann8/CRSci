'use client';

import { PlayIcon } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import QuestionIcon from '@/app/assets/icons/QuestionIcon';
import ResourceIcon from '@/app/assets/icons/ResourceIcon';
import CheckPointIcon from '@/app/assets/icons/CheckPointIcon';
import CardContent, { IconProps } from '@/app/components/common/CardContent';

export interface Card {
    id: string;
    imageUrl: string | StaticImport;
    Text: string;
    Questions: number;
    Checkpoints: number;
}

interface VideoCardProps {
    card: Card;
    isModal?: boolean;
    onClickEditBtn?: (id: string) => void;
}

function VideoCard({ card, isModal, onClickEditBtn }: VideoCardProps) {
    const Icons: IconProps = {
        FirstIcon: QuestionIcon,
        SecondIcon: CheckPointIcon,
        ThirdIcon: ResourceIcon,
    };
    return (
        <div className=" bg-white border rounded-lg shadow flex flex-col justify-center md:p-4 mobile:p-2 h-96">
            <div className="h-[60%] relative">
                <Link href={`/admin/video/${card.id}`}>
                    <Image
                        src={card.imageUrl}
                        alt="video"
                        className="w-full h-full rounded-lg object-cover"
                        width={100}
                        height={0}
                    />
                    <div className="absolute left-1/2 bottom-[29%] transform -translate-x-1/2 -translate-y-1/2">
                        <PlayIcon fill="white" color="white" size={35} />
                    </div>
                </Link>
            </div>
            <div className="h-[40%] mt-2">
                <CardContent
                    id={card.id}
                    heading={card.Text}
                    first={`Questions (${card.Questions})`}
                    second={`Checkpoints (${card.Checkpoints})`}
                    Icons={Icons}
                    isModal={isModal}
                    route="/admin/video"
                    handleOpenEditModal={onClickEditBtn}
                />
            </div>
        </div>
    );
}

export default VideoCard;
