import { CalendarDays, File } from 'lucide-react';
import React from 'react';

import Searchbar from '@/app/components/common/Searchbar';
import LearningCard from './LearningCard';
import LearningTable, { LearningInterface } from './LearningTable';

export const LearningRecord: LearningInterface[] = [
    {
        id: 1,
        name: '3D Printing ',
        duration: '5:00',
        questions: '4',
        status: 'Play',
        isDone: true,
        isDisabled: false,
        resourceType: 'video',
    },
    {
        id: 1,
        name: '3D Printing ',
        duration: '5:00',
        questions: '4',
        status: 'Continue',
        isDone: true,
        isDisabled: false,
        resourceType: 'video',
    },
    {
        id: 1,
        name: '3D Printing ',
        duration: '5:00',
        questions: '4',
        status: 'Play',
        isDone: false,
        isDisabled: false,
        resourceType: 'openEndedQuiz',
    },
    {
        id: 1,
        name: '3D Printing ',
        duration: '5:00',
        questions: '4',
        status: 'Continue',
        isDone: false,
        isDisabled: false,
        resourceType: 'quiz',
    },
];

export const LearningRecord2: LearningInterface[] = [
    {
        id: 1,
        name: '3D Printing ',
        duration: '5:00',
        questions: '4',
        status: 'Play',
        isDone: false,
        isDisabled: true,
        resourceType: 'quiz',
    },
    {
        id: 1,
        name: '3D Printing ',
        duration: '5:00',
        questions: '4',
        status: 'Continue',
        isDone: false,
        isDisabled: true,
        resourceType: 'quiz',
    },
    {
        id: 1,
        name: '3D Printing ',
        duration: '5:00',
        questions: '4',
        status: 'Play',
        isDone: false,
        isDisabled: true,
        resourceType: 'video',
    },
    {
        id: 1,
        name: '3D Printing ',
        duration: '5:00',
        questions: '4',
        status: 'Continue',
        isDone: false,
        isDisabled: true,
        resourceType: 'video',
    },
];

export const standards = [
    {
        id: '1',
        heading: 'JavaScript Basics',
        first: 'Videos (15)',
        second: 'Exercises (10)',
        third: 'Course Length (2 Weeks)',
    },
    {
        id: '2',
        heading: 'HTML Fundamentals',
        first: 'Videos (12)',
        second: 'Exercises (8)',
        third: 'Course Length (1.5 Weeks)',
    },
    {
        key: '3',
        heading: 'CSS Essentials',
        first: 'Videos (18)',
        second: 'Exercises (12)',
        third: 'Course Length (2.5 Weeks)',
    },
    {
        id: '4',
        heading: 'Artificial Intelligence - AI',
        first: 'Videos (20)',
        second: 'Exercises (15)',
        third: 'Course Length (3 Weeks)',
        isActive: true,
    },
    {
        id: '5',
        heading: 'Node.js Basics',
        first: 'Videos (10)',
        second: 'Exercises (7)',
        third: 'Course Length (1.5 Weeks)',
    },
    {
        id: '6',
        heading: 'Python for Beginners',
        first: 'Videos (14)',
        second: 'Exercises (9)',
        third: 'Course Length (2 Weeks)',
    },
];
type StandardData = {
    id: string;
    name: string;
    courseLength: string;
    totalVideoUploads: string;
    totalNonVideoUploads: string;
};

function Learning({ standards }: { standards: StandardData[] }) {
    return (
        <div>
            <Searchbar
                headerText="My Learnings"
                tagline="Here’s Your All Learning Assigned to You"
            />
            <div className="flex justify-between items-center mt-8">
                <p className="font-medium text-xl ">Your Assigned Learnings</p>
            </div>
            {standards?.length > 0 ? (
                <div className="my-8">
                    <LearningCard standards={standards} />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-96 mt-5 bg-white rounded-lg shadow-lg">
                    <CalendarDays size={48} />
                    <p className="text-lg font-semibold mt-4">
                        No Learning Assigned
                    </p>
                </div>
            )}
        </div>
    );
}

export default Learning;
