import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface ClassroomCardProps {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
    periods: string;
    students: number | string;
    iconColor?: string;
    iconBg?: string;
    activeColor?: string;
    onClick?: (period: string) => void;
}

function ClassroomCard({
    Icon,
    periods,
    students,
    iconColor,
    iconBg,
    activeColor,
    onClick,
}: ClassroomCardProps) {
    const borderColorClass = iconColor ? `border-[${iconColor}]` : '';
    const [isActive, setIsActive] = useState(false);
    return (
        <div
            className={`col-span-1 mobile:col-span-2 relative group p-4 flex flex-col justify-evenly h-[163px] w-full rounded-lg border ${
                isActive && `${borderColorClass}`
            } ${isActive ? `${activeColor}` : ''}`}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            onClick={() => onClick?.(periods)}
        >
            <div
                className={`bg-green-100 px-3 h-fit py-3 rounded-full w-fit ${
                    iconBg ?? ''
                }`}
            >
                <Icon fill={iconColor ?? '#7AA43E'} width="30" height="30" />
            </div>
            <p className="text-base">{periods}</p>
            <h1 className="font-semibold text-3xl">{students}</h1>

            {/* <button
                type="button"
                className="absolute top-6 right-7 bg-primary-color text-white py-2 px-4 rounded-lg opacity-0 group-lg:hover:opacity-100 transition-opacity"
            >
                Details
            </button> */}

            {isActive && (
                <button
                    type="button"
                    className="absolute top-6 right-7 bg-primary-color text-white py-2 px-4 rounded-lg"
                >
                    Details
                </button>
            )}
        </div>
    );
}

export default ClassroomCard;
