'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { convertSpacesToDashes } from '@/lib/utils';

interface CardProps {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
    cardText: string;
    count: number | string;
    currentPath?: string;
    isSchool?: boolean;
    iconBackgroundColour?: string;
    iconViewBox?: string;
    iconColor?: string;
    iconWidth?: number;
    iconHeight?: number;
}

function Card({
    Icon,
    cardText,
    count,
    currentPath,
    isSchool,
    iconBackgroundColour, // you can use tailwind here as used outisde svg Icon
    iconViewBox, // svg props
    iconColor, // svg props -> give this color in form of hex not tailwind as being used inside svg Icon
    iconWidth = 40, // svg props
    iconHeight = 40, // svg props
}: CardProps) {
    const URL = convertSpacesToDashes(cardText);
    const path = usePathname();

    return (
        <div className="col-span-1 relative mobile:col-span-2 p-3 flex flex-col gap-1 h-[172px] w-full rounded-lg border group hover:bg-orange-100 hower:border-amber-700">
            <div className={`${iconBackgroundColour} w-10 rounded-full`}>
                <Icon
                    width={iconWidth}
                    height={iconHeight}
                    viewBox={iconViewBox}
                    color={iconColor}
                />
            </div>
            <p className="text-base">{cardText}</p>
            <h1 className="font-semibold text-3xl">{count}</h1>
            {!isSchool && (
                <div className="absolute right-2 bottom-6">
                    <Link
                        href={currentPath ? `${currentPath}` : `${path}/${URL}`}
                        className="border rounded-lg text-dark-gray px-3 py-2  text-sm font-medium text-center mr-2 w-24 lg:hover:bg-primary-color lg:hover:text-white pointer-events-auto group-hover:bg-primary-color group-hover:text-white"
                    >
                        Details
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Card;
