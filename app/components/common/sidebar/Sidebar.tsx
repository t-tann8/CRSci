'use client';

// eslint-disable-next-line import/no-extraneous-dependencies
import { signOut } from 'next-auth/react';
import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    User as UserIcon,
    Settings,
    Menu,
    X,
    LogOut,
    LayoutGrid,
    Lightbulb,
    Bookmark,
    GraduationCap,
    CreditCard,
    BookText,
} from 'lucide-react';
import crsLogo from '@/app/assets/images/crsclogo.svg';
import SlideShowIcon from '@/app/assets/icons/SlideShowIcon';
import ResourceIcon from '@/app/assets/icons/ResourceIcon';
import QueryIcon from '@/app/assets/icons/QueryIcon';
import StandardIcon from '@/app/assets/icons/StandardIcon';
import DataAggregationIcon from '@/app/assets/icons/DataAggregationIcon';
import TeacherStandardIcon from '@/app/assets/icons/TeacherStandardIcon';
import TeacherIcon from '@/app/assets/icons/TeacherIcon';
import NavigationItem, { NavigationItemProps } from './NavigationItem';

export default function SideBar() {
    const [menu, SetMenu] = useState(false);
    const path = usePathname();

    let navItems: NavigationItemProps[] = [];
    if (path.startsWith('/admin')) {
        navItems = [
            {
                to: '/admin',
                ItemIcon: LayoutGrid,
                itemText: 'Dashboard',
            },
            {
                to: '/admin/video',
                ItemIcon: SlideShowIcon,
                itemText: 'Video',
            },
            {
                to: '/admin/resources',
                ItemIcon: ResourceIcon,
                itemText: 'Resources',
            },
            // {
            //     to: '#',
            //     ItemIcon: QueryIcon,
            //     itemText: 'Query',
            // },
            {
                to: '/admin/standard',
                ItemIcon: StandardIcon,
                itemText: 'Standard',
            },
            {
                to: '/admin/users',
                ItemIcon: UserIcon,
                itemText: 'Users',
            },
            {
                to: '/admin/setting',
                ItemIcon: Settings,
                itemText: 'Settings',
            },
            {
                to: '#',
                ItemIcon: LogOut,
                itemText: 'Logout',
                onClick: () => signOut(),
            },
        ];
    } else if (path.startsWith('/teacher')) {
        navItems = [
            {
                to: '/teacher',
                ItemIcon: LayoutGrid,
                itemText: 'Dashboard',
            },
            {
                to: '/teacher/students',
                ItemIcon: UserIcon,
                itemText: 'Students',
            },
            {
                to: '/teacher/learning-plans',
                ItemIcon: StandardIcon,
                itemText: 'Learning Plans',
            },
            {
                to: '/teacher/classroom',
                ItemIcon: GraduationCap,
                itemText: 'Classroom',
            },
            {
                to: '/teacher/setting',
                ItemIcon: Settings,
                itemText: 'Settings',
            },
            {
                to: '#',
                ItemIcon: LogOut,
                itemText: 'Logout',
                onClick: () => signOut(),
            },
        ];
    } else if (path.startsWith('/student')) {
        navItems = [
            {
                to: '/student',
                ItemIcon: LayoutGrid,
                itemText: 'Dashboard',
            },
            {
                to: '/student/learning',
                ItemIcon: Lightbulb,
                itemText: 'Learning',
            },
            // {
            //     to: '/student/saved-videos',
            //     ItemIcon: Bookmark,
            //     itemText: 'Saved Videos',
            // },
            {
                to: '/student/profile',
                ItemIcon: UserIcon,
                itemText: 'Profile',
            },
            {
                to: '/student/assignments',
                ItemIcon: ResourceIcon,
                itemText: 'All Assignments',
            },
            {
                to: '/student/setting',
                ItemIcon: Settings,
                itemText: 'Settings',
            },
            {
                to: '#',
                ItemIcon: LogOut,
                itemText: 'Logout',
                onClick: () => signOut(),
            },
        ];
    } else if (path.startsWith('/school')) {
        navItems = [
            {
                to: '/school',
                ItemIcon: LayoutGrid,
                itemText: 'Dashboard',
            },
            {
                to: '/school/teachers',
                ItemIcon: TeacherIcon,
                itemText: 'Teachers',
            },
            {
                to: '/school/classrooms',
                ItemIcon: BookText,
                itemText: 'Classrooms',
            },
            {
                to: '/school/data-aggregation',
                ItemIcon: DataAggregationIcon,
                itemText: 'Data Aggregation',
            },
            {
                to: '/school/payment',
                ItemIcon: CreditCard,
                itemText: 'Payments',
            },
            {
                to: '/school/setting',
                ItemIcon: Settings,
                itemText: 'Settings',
            },
            {
                to: '#',
                ItemIcon: LogOut,
                itemText: 'Logout',
                onClick: () => signOut(),
            },
        ];
    }

    return (
        <section className="bg-light-gray md:w-[90px] lg:w-fit md:p-3 md:fixed">
            {/* Desktop Navbar */}
            <ul className="lg:flex flex-col w-full items-center justify-center hidden  pt-5 h-screen">
                <Image
                    src={crsLogo as string}
                    alt="crs logo"
                    style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'contain',
                        marginBottom: '35px',
                    }}
                />
                <div className="flex flex-col justify-start items-center h-full">
                    {navItems
                        .slice(0, navItems.length - 2)
                        .map((item, index) => (
                            <NavigationItem
                                // eslint-disable-next-line react/no-array-index-key
                                key={index + 1}
                                to={item.to}
                                ItemIcon={item.ItemIcon}
                                itemText={item.itemText}
                            />
                        ))}
                </div>
                <div className="mb-5">
                    {navItems
                        .slice(navItems.length - 2, navItems.length)
                        .map((item, index) => (
                            <NavigationItem
                                // eslint-disable-next-line react/no-array-index-key
                                key={index + 1}
                                to={item.to}
                                ItemIcon={item.ItemIcon}
                                itemText={item.itemText}
                                onClick={item.onClick}
                            />
                        ))}
                </div>
            </ul>

            {/* Tab View NavBar */}
            <ul className="md:flex lg:hidden flex-col w-full items-center justify-center hidden  pt-5 h-screen">
                <Image
                    src={crsLogo as string}
                    alt="crs logo"
                    style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'contain',
                        marginBottom: '35px',
                    }}
                />
                <div className="flex flex-col justify-start items-center h-full">
                    {navItems
                        .slice(0, navItems.length - 2)
                        .map((item, index) => (
                            <NavigationItem
                                // eslint-disable-next-line react/no-array-index-key
                                key={index + 1}
                                to={item.to}
                                ItemIcon={item.ItemIcon}
                                // itemText={item.itemText}
                            />
                        ))}
                </div>
                <div className="mb-5">
                    {navItems
                        .slice(navItems.length - 2, navItems.length)
                        .map((item, index) => (
                            <NavigationItem
                                // eslint-disable-next-line react/no-array-index-key
                                key={index + 1}
                                to={item.to}
                                ItemIcon={item.ItemIcon}
                                onClick={item.onClick}
                                // itemText={item.itemText}
                            />
                        ))}
                </div>
            </ul>

            {/* Mobile Navbar */}
            <ul className="md:hidden bg-light-gray w-screen p-4">
                <div className="flex justify-between items-center">
                    <Image
                        src={crsLogo as string}
                        alt="crs logo"
                        priority
                        style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'contain',
                        }}
                    />
                    <div onClick={() => SetMenu(!menu)}>
                        {menu ? (
                            <X width={35} height={35} />
                        ) : (
                            <Menu width={35} height={35} />
                        )}
                    </div>
                </div>
                {menu && (
                    <div className="flex flex-col justify-start items-center h-full">
                        {navItems.map((item, index) => (
                            <NavigationItem
                                // eslint-disable-next-line react/no-array-index-key
                                key={index + 1}
                                to={item.to}
                                ItemIcon={item.ItemIcon}
                                itemText={item.itemText}
                                onClick={item.onClick}
                                closeMenu={() => SetMenu(false)}
                            />
                        ))}
                    </div>
                )}
            </ul>
        </section>
    );
}
