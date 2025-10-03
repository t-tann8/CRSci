'use client';

import React, { useState } from 'react';
import TabBar from '@/app/components/common/TabBar';
import Filters from '@/app/components/common/Filters';
import videoImage1 from '@/app/assets/images/videoImages/videoImage1.svg';
import videoImage2 from '@/app/assets/images/videoImages/videoImage2.svg';
import videoImage3 from '@/app/assets/images/videoImages/videoImage3.svg';
import videoImage4 from '@/app/assets/images/videoImages/videoImage4.svg';
import videoImage5 from '@/app/assets/images/videoImages/videoImage5.svg';
import videoImage6 from '@/app/assets/images/videoImages/videoImage6.svg';
import ResourceCard, { ResourceCardInterface } from './ResourceCard';
import AddResourceModal from './AddResourceModal';

function ResourcesList() {
    const tabOptions = [
        'All',
        'Videos',
        'SlideShow',
        'WorkSheet',
        'Quizzes',
        'Assisments',
    ];

    const cards: ResourceCardInterface[] = [
        {
            id: '1',
            imageUrl: videoImage1 as string,
            Text: 'Master Digital Product Design..',
            Questions: 5,
            Checkpoints: 3,
            Resources: 8,
            resourceType: 'slideshow',
            isSelected: false,
        },
        {
            id: '2',
            imageUrl: videoImage2 as string,
            Text: 'User Experience Design Fund...',
            Questions: 5,
            Checkpoints: 3,
            Resources: 8,
            resourceType: 'video',
            isSelected: true,
        },
        {
            id: '3',
            imageUrl: videoImage3 as string,
            Text: 'Learn Figma: Basic Fundemen..',
            Questions: 5,
            Checkpoints: 3,
            Resources: 8,
            resourceType: 'worksheet',
            isSelected: false,
        },
        {
            id: '4',
            imageUrl: videoImage4 as string,
            Text: 'learn Figma: User Interface..',
            Questions: 5,
            Checkpoints: 3,
            Resources: 8,
            resourceType: 'video',
            isSelected: false,
        },
        {
            id: '5',
            imageUrl: videoImage5 as string,
            Text: 'Essentials Principal for UI UX...',
            Questions: 5,
            Checkpoints: 3,
            Resources: 8,
            resourceType: 'quiz',
            isSelected: true,
        },
        {
            id: '6',
            imageUrl: videoImage6 as string,
            Text: 'Master Digital Product Design..',
            Questions: 5,
            Checkpoints: 3,
            Resources: 8,
            resourceType: 'assisment',
            isSelected: false,
        },
    ];

    const [selectedTab, setSelectedTab] = useState('all');
    const onSelectFilter = (tab: string) => {
        setSelectedTab(tab);
    };

    // Function to convert tabOptions to lowercase and handle special cases
    const normalizeTab = (tab: string): string => {
        if (tab.toLowerCase() === 'videos') {
            return 'video';
        }
        if (tab.toLowerCase() === 'quizzes') {
            return 'quiz';
        }
        if (tab.toLowerCase() === 'assisments') {
            return 'assisment';
        }
        return tab.toLowerCase();
    };

    // Filter the resources based on the selected tab
    const filteredResources = cards.filter((card) => {
        if (selectedTab === 'all') {
            return true; // Show all resources
        }
        return normalizeTab(selectedTab) === card.resourceType.toLowerCase();
    });

    return (
        <section>
            <TabBar
                options={tabOptions}
                initialSelectedTab="all"
                onSelectFilter={onSelectFilter}
            />
            <Filters text="SB1 Cell Structure - Function" />
            <div className="mt-8 ">
                <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-col-1 gap-4 md:gap-6 ">
                    {filteredResources.map((card) => (
                        <ResourceCard card={card} key={card.Questions} />
                    ))}
                </div>
            </div>
            {/* <div className="fixed right-0 top-0 z-50 lg:w-[25%]">
                <AddResourceModal />
            </div> */}
        </section>
    );
}

export default ResourcesList;
