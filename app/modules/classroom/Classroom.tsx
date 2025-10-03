'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import StudentIcon from '@/app/assets/icons/StudentIcon';
import { ShieldAlert } from 'lucide-react';
import ClassroomCard from './ClassroomCard';

const colors = [
    { iconColor: '#54C3F4', iconBg: 'bg-sky-100', activeColor: 'bg-sky-50' },
    {
        iconColor: '#7AA43E',
        iconBg: 'bg-green-100',
        activeColor: 'bg-green-50',
    },
    {
        iconColor: '#A03ADB',
        iconBg: 'bg-purple-100',
        activeColor: 'bg-purple-50',
    },
    {
        iconColor: '#F59A3B',
        iconBg: 'bg-orange-200',
        activeColor: 'bg-orange-50',
    },
    { iconColor: '#E6500D', iconBg: 'bg-pink-100', activeColor: 'bg-pink-50' },
];

function Classroom({
    summarizedClassrooms,
}: {
    summarizedClassrooms: { id: string; name: string; studentCount: number }[];
}) {
    const { push } = useRouter();
    const pathname = usePathname();
    const [selectedClass, setSelectedClass] = useState('');
    const showClassStudents = (viewClass: React.SetStateAction<string>) => {
        setSelectedClass(viewClass);
        const detailsSection = document.getElementById('classDetailsSection');
        if (detailsSection) {
            detailsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return summarizedClassrooms?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {summarizedClassrooms.map((classroom, index) => {
                const colorIndex = index % colors.length;
                const { iconColor, iconBg, activeColor } = colors[colorIndex];
                return (
                    <ClassroomCard
                        key={classroom.id}
                        Icon={StudentIcon}
                        periods={`${classroom.name}`}
                        students={`${classroom.studentCount} Students`}
                        iconColor={iconColor}
                        iconBg={iconBg}
                        activeColor={activeColor}
                        onClick={() => push(`${pathname}/${classroom.id}`)}
                    />
                );
            })}
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center w-full h-72 bg-white rounded-lg shadow-lg">
            <ShieldAlert size={48} />
            <p className="text-lg font-semibold mt-4">No Classroom Found</p>
        </div>
    );
}

export default Classroom;
