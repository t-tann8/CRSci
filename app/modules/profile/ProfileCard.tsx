import { LucideIcon } from 'lucide-react';
import React from 'react';

interface CardProps {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
    header: string;
    description: number | string;
    iconColor?: string;
    iconBg?: string;
    border?: string;
}

function ProfileCard({
    Icon,
    header,
    description,
    iconColor,
    iconBg,
    border,
}: CardProps) {
    return (
        <div
            className={`col-span-1 mobile:col-span-2 p-4 flex flex-col justify-evenly h-[163px] w-full rounded-lg border ${border}  `}
        >
            <div
                className={`bg-green-100 px-3 h-fit py-3 rounded-full w-fit ${
                    iconBg ?? ''
                }`}
            >
                <Icon stroke={iconColor} width="30" height="30" />
            </div>
            <p className="text-base">{header}</p>
            <h1 className="font-semibold text-2xl">{description}</h1>
        </div>
    );
}

export default ProfileCard;
