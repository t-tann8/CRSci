'use client';

// component is client beacuse of pagination
import React from 'react';
import Filters from '@/app/components/common/Filters';
import Searchbar from '@/app/components/common/Searchbar';
import Pagintaion from '@/app/components/common/Pagintaion';
import TopicsTable, { TopicsInterface } from './TopicsTable';

export const topicsList: TopicsInterface[] = [
    {
        id: 1,
        topic: 'SB1 Cell Structure - Function',
        assignedResources: '5',
    },
    {
        id: 1,
        topic: 'SB1 Cell Structure - Function',
        assignedResources: '5',
    },
    {
        id: 1,
        topic: 'SB1 Cell Structure - Function',
        assignedResources: '5',
    },
    {
        id: 1,
        topic: 'SB1 Cell Structure - Function',
        assignedResources: '5',
    },
    {
        id: 1,
        topic: 'SB1 Cell Structure - Function',
        assignedResources: '5',
    },
    {
        id: 1,
        topic: 'SB1 Cell Structure - Function',
        assignedResources: '5',
    },
    {
        id: 1,
        topic: 'SB1 Cell Structure - Function',
        assignedResources: '5',
    },
];
function TopicsList() {
    return (
        <div>
            <div className="w-full ">
                <div className="border rounded-lg p-5 mt-10">
                    <Filters text="All Standard's" />
                    <TopicsTable topics={topicsList} />
                </div>
                <div className="flex justify-center items-center mt-5">
                    <Pagintaion />
                </div>
            </div>
        </div>
    );
}

export default TopicsList;
