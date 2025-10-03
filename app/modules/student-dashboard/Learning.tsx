import React from 'react';
import { CalendarDays, File, PlayIcon } from 'lucide-react';
import CardContent from '@/app/components/common/CardContent';

type StandardData = {
    standardId: string;
    standardName: string;
    videoResourcesCount: number;
    nonVideoResourcesCount: number;
};

async function Learning({ standards }: { standards: StandardData[] }) {
    const Icons = {
        FirstIcon: PlayIcon,
        SecondIcon: File,
        ThirdIcon: CalendarDays,
    };
    return (
        <div>
            {standards?.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-72 bg-white rounded-lg shadow-lg">
                    <CalendarDays size={48} />
                    <p className="text-lg font-semibold mt-4">
                        No Learning Assigned
                    </p>
                </div>
            ) : (
                <section className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
                    {standards?.map((standard, index) => (
                        <div
                            key={standard.standardId || index}
                            className="rounded-lg border p-4"
                        >
                            <CardContent
                                id={standard.standardId}
                                route="/student/learning"
                                heading={standard.standardName}
                                first={`Videos (${standard.videoResourcesCount})`}
                                second={`Exercises (${standard.nonVideoResourcesCount})`}
                                Icons={Icons}
                                isHideEditIcon
                                isShownFromStudent
                            />
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}

export default Learning;
