import { CalendarDays, File, PlayIcon } from 'lucide-react';
import React from 'react';

function CourseCard({
    name,
    videoCount,
    otherResourcesCount,
    courseLength,
}: {
    name: string;
    videoCount: string;
    otherResourcesCount: string;
    courseLength: string;
}) {
    return (
        <div className="rounded-lg border p-4 mb-4">
            <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900">
                {name}
            </h5>
            <div>
                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex gap-1 text-dark-gray text-xs">
                        <PlayIcon height={17} width={17} color="#F59A3B" />
                        <p>Videos ({videoCount})</p>
                        <File width={17} height={17} color="#7AA43E" />
                        <p>Other Resources ({otherResourcesCount})</p>
                    </div>
                    <div className="flex gap-1 text-dark-gray text-xs">
                        <CalendarDays height={17} width={17} color="#54C3F4" />
                        <p>Course Length ({courseLength})</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseCard;
