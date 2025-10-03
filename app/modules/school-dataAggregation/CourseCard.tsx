'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export interface CourseCardInterface {
    name: string;
    id: string;
}
function CourseCard({ name, id }: CourseCardInterface) {
    const { push } = useRouter();
    return (
        <div className="rounded-xl p-5 border">
            <h1 className="font-semibold text-xl">{name}</h1>
            <div className="flex justify-end  mt-4">
                <p
                    className="border px-3 py-3 rounded-lg cursor-pointer lg:hover:bg-primary-color lg:hover:text-white"
                    onClick={() => push(`/school/data-aggregation/${id}`)}
                >
                    Details
                </p>
            </div>
        </div>
    );
}

export default CourseCard;
