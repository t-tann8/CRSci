'use client';

import { useRouter, usePathname } from 'next/navigation';
import { CalendarDays, File, PlayIcon } from 'lucide-react';
import React from 'react';
import CardContent from '@/app/components/common/CardContent';
import Filters from '@/app/components/common/Filters';

type StandardData = {
    id: string;
    name: string;
    courseLength: string;
    totalVideoUploads: string;
    totalNonVideoUploads: string;
    topicCount: string;
};

function Standard({
    isShownFromTeacher,
    standardsCount,
    allStandards,
}: {
    isShownFromTeacher?: boolean;
    standardsCount: number;
    allStandards?: StandardData[];
}) {
    const Icons = {
        FirstIcon: PlayIcon,
        SecondIcon: File,
        ThirdIcon: CalendarDays,
    };
    const { push } = useRouter();
    const pathname = usePathname();

    function handleClick(): void {
        push(`${pathname}/create`);
    }
    return (
        <>
            <Filters
                text={
                    isShownFromTeacher
                        ? `${standardsCount} Learning Plans In Total`
                        : `${standardsCount} Learning Standards In Total`
                }
                secondButtonText={
                    isShownFromTeacher ? 'Create New Plan' : 'Create New'
                }
                handleClick={() => handleClick()}
                isHideFirstBtn
                isHideSecondBtn={isShownFromTeacher}
            />
            <section>
                {standardsCount > 0 ? (
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
                        {allStandards?.map((standard, index) => (
                            <div
                                className="rounded-lg border p-4"
                                key={standard.id || index}
                            >
                                <CardContent
                                    id={standard.id}
                                    route={
                                        isShownFromTeacher
                                            ? '/teacher/learning-plans'
                                            : '/admin/standard'
                                    }
                                    heading={standard.name}
                                    second={`Topics (${standard.topicCount})`}
                                    third={`Course Length (${standard.courseLength})`}
                                    Icons={Icons}
                                    isHideEditIcon={isShownFromTeacher}
                                    isFromStandard
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-72">
                        <p className="text-lg text-gray-500 text-center">
                            No Learning Standards Found!
                        </p>
                    </div>
                )}
            </section>
        </>
    );
}

export default Standard;
