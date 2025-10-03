'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { CalendarDays, File, PlayIcon } from 'lucide-react';

// export const standards = [
//     {
//         id: '1',
//         heading: 'JavaScript Basics',
//         first: 'Videos (15)',
//         second: 'Exercises (10)',
//         third: 'Course Length (2 Weeks)',
//     },
//     {
//         id: '2',
//         heading: 'HTML Fundamentals',
//         first: 'Videos (12)',
//         second: 'Exercises (8)',
//         third: 'Course Length (1.5 Weeks)',
//     },
//     {
//         key: '3',
//         heading: 'CSS Essentials',
//         first: 'Videos (18)',
//         second: 'Exercises (12)',
//         third: 'Course Length (2.5 Weeks)',
//     },
//     {
//         id: '4',
//         heading: 'Artificial Intelligence - AI',
//         first: 'Videos (20)',
//         second: 'Exercises (15)',
//         third: 'Course Length (3 Weeks)',
//         isActive: true,
//     },
//     {
//         id: '5',
//         heading: 'Node.js Basics',
//         first: 'Videos (10)',
//         second: 'Exercises (7)',
//         third: 'Course Length (1.5 Weeks)',
//     },
//     {
//         id: '6',
//         heading: 'Python for Beginners',
//         first: 'Videos (14)',
//         second: 'Exercises (9)',
//         third: 'Course Length (2 Weeks)',
//     },
// ];
type StandardData = {
    id: string;
    name: string;
    courseLength: string;
    totalVideoUploads: string;
    totalNonVideoUploads: string;
};

function LearningCard({ standards }: { standards: StandardData[] }) {
    const [activeStandard, setActiveStandard] = useState<string | null>('4');

    const Icons = {
        FirstIcon: PlayIcon,
        SecondIcon: File,
        ThirdIcon: CalendarDays,
    };
    const { push } = useRouter();
    const pathname = usePathname();

    function handleClick(standardId: string): void {
        setActiveStandard(standardId);
        push(`${pathname}/${standardId}`);
    }
    return (
        <section className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
            {standards?.length > 0 ? (
                standards?.map((standard: StandardData) => (
                    <div key={standard.id} className="rounded-lg border p-4">
                        <div className="mt-2">
                            <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900">
                                {standard.name}
                            </h5>
                            <div>
                                <div className="flex gap-2 mb-2">
                                    <div className="flex gap-1 items-center text-dark-gray text-sm">
                                        <PlayIcon
                                            height={17}
                                            width={17}
                                            color="#F59A3B"
                                        />
                                        <p>{`Videos(${standard.totalVideoUploads})`}</p>
                                    </div>
                                    <div className="flex gap-1 items-center text-dark-gray text-sm">
                                        <File
                                            width={17}
                                            height={17}
                                            color="#7AA43E"
                                        />
                                        <p>{`Other Resources(${standard.totalNonVideoUploads})`}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 items-center mb-5 text-dark-gray text-sm">
                                    <CalendarDays
                                        height={17}
                                        width={17}
                                        color="#54C3F4"
                                    />
                                    <p>{`Course Length(${standard.courseLength})`}</p>
                                </div>
                            </div>

                            <div className="flex items-end justify-end">
                                <div
                                    onClick={() => handleClick(standard.id)}
                                    className="border rounded-lg text-dark-gray px-4 py-2 text-sm font-medium text-center mr-2 mb-2 cursor-pointer lg:hover:bg-primary-color lg:hover:text-white"
                                >
                                    View
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-96 mt-5 bg-white rounded-lg shadow-lg">
                    <CalendarDays size={48} />
                    <p className="text-lg font-semibold mt-4">
                        No Learning Assigned
                    </p>
                </div>
            )}
        </section>
    );
}

export default LearningCard;
