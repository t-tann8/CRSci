'use client';

import React from 'react';

function Tabs({
    activeTab,
    setActiveTabLocal,
    tabOptions,
}: {
    activeTab: string;
    setActiveTabLocal: (tab: string) => void;
    tabOptions: string[];
}) {
    const handleTabClick = (tab: string) => {
        setActiveTabLocal(tab);
    };

    return (
        <div className="flex space-x-3">
            {tabOptions.map((tab) => (
                <button
                    key={tab}
                    type="button"
                    className={`py-2 px-4 border-2 rounded-xl ${
                        activeTab === tab
                            ? 'border-primary-color bg-orange-50'
                            : ''
                    }`}
                    onClick={() => handleTabClick(tab)}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );
}

export default Tabs;
