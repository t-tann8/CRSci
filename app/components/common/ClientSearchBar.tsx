'use client';

import React from 'react';
import { LucideIcon, BellIcon, ArrowLeft } from 'lucide-react';
import SearchInput from './SearchInput';

interface SearchbarProp {
    headerText: string;
    tagline: string;
    extendedTagline?: string;
    Icon?:
        | React.ComponentType<React.SVGProps<SVGSVGElement>>
        | LucideIcon
        | null;
    iconColor?: string;
    isShowBackArrow?: boolean;
    onBackClick?: () => void;
}

function ClientSearchbar({
    headerText,
    tagline,
    extendedTagline,
    Icon,
    iconColor = 'black',
    isShowBackArrow,
    onBackClick,
}: SearchbarProp) {
    return (
        <div className="flex md:justify-between md:items-center flex-col md:flex-row mb-4 lg:sticky md:top-0 bg-white z-30 shrink-0 py-2">
            <div className="flex flex-col justify-start items-start  ">
                <div className="flex space-x-3 items-center ">
                    {isShowBackArrow && (
                        <div className="cursor-pointer">
                            <ArrowLeft onClick={onBackClick} />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <div className="flex  items-center font-semibold text-2xl mb-1">
                            <h1 className="mr-1">{headerText}</h1>
                            {Icon && (
                                <Icon
                                    width={25}
                                    height={25}
                                    color={iconColor}
                                />
                            )}
                        </div>
                        <p className="text-dark-gray text-sm mb-3 md:mb-0">
                            {tagline}
                            <span className="text-amber-500">
                                {extendedTagline}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <SearchInput />
                <BellIcon
                    width={45}
                    height={45}
                    className="cursor-pointer p-3 rounded-lg ml-3 border bg-white"
                />
            </div>
        </div>
    );
}

export default ClientSearchbar;
