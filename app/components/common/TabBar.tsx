'use client';

import React, { useState, useEffect } from 'react';
import { Poppins } from 'next/font/google';

interface TabBarProps {
    options: string[];
    onSelectFilter: (tab: string) => void;
    initialSelectedTab: string;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});

function TabBar({ options, onSelectFilter, initialSelectedTab }: TabBarProps) {
    const [activeTab, setActiveTabLocal] = useState(initialSelectedTab);

    useEffect(() => {
        setActiveTabLocal(initialSelectedTab);
    }, [initialSelectedTab]);

    const handleTabClick = (tab: string) => {
        setActiveTabLocal(tab);
        onSelectFilter(tab);
    };

    return (
        <div
            className={`flex items-center gap-2 justify-start flex-wrap my-6 w-full border py-2 px-4 rounded-lg pt-4 ${poppins.className}`}
        >
            {options.length > 0 ? (
                options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        className={`py-2 px-4 rounded-lg text-center mb-2 mr-2 ${
                            activeTab === option
                                ? 'bg-primary-color text-white'
                                : 'bg-gray-200 text-gray-700'
                        } sm:px-6 md:px-8 lg:px-10 xl:px-12`}
                        onClick={() => handleTabClick(option)}
                    >
                        {option}
                    </button>
                ))
            ) : (
                <div className="text-center w-full text-md">
                    No Class found!
                </div>
            )}
        </div>
    );
}

export default TabBar;
