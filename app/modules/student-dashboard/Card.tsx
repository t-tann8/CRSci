import { LucideIcon, MoveDownRight } from 'lucide-react';
import React from 'react';

interface CardProps {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
    header: string;
    description: number | string;
    iconColor?: string;
    iconBg?: string;
    border?: string;
    isShowAlert?: boolean;
}

function Card({
    Icon,
    header,
    description,
    iconColor,
    iconBg,
    border,
    isShowAlert,
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
            <div className="flex space-x-2 items-center">
                <h1 className="font-semibold text-3xl">{description}</h1>
                {isShowAlert && (
                    <>
                        <div className=" p-[2px] border-2 w-fit border-red-300 rounded-md">
                            <MoveDownRight color="#E6500D" size={14} />
                        </div>
                        <p className="text-gray-600 font-medium text-center">
                            3 Quizzes Failed
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Card;
