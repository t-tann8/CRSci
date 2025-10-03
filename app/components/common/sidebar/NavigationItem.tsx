'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

export interface NavigationItemProps {
    to: string;
    ItemIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
    itemText?: string;
    // eslint-disable-next-line react/no-unused-prop-types
    onClick?: () => void;
    closeMenu?: () => void;
}

function NavigationItem({
    to,
    ItemIcon,
    itemText,
    onClick,
    closeMenu,
}: NavigationItemProps) {
    const pathname = usePathname();
    const role = pathname.split('/')[1];

    const isActive =
        pathname === to || (pathname.startsWith(to) && to !== `/${role}`);

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        if (closeMenu) {
            closeMenu();
        }
    };

    return (
        <Link
            onClick={handleClick}
            href={to}
            // w-52
            className={`flex justify-start items-center w-52 md:w-[48px] md:h-[48px]   lg:w-52 p-3 mb-2 rounded-lg font-semibold text-sm ${
                isActive ? 'text-white bg-primary-color' : 'text-black'
            }`}
        >
            <div className="lg:mx-4 md:mx-0 mx-4">
                {isActive ? (
                    <ItemIcon color="white" />
                ) : (
                    <ItemIcon color="black" />
                )}
            </div>
            <li>{itemText}</li>
        </Link>
    );
}

export default NavigationItem;
