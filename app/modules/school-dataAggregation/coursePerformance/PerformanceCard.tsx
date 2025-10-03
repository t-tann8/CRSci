'use client';

import { LucideMoveUpRight, MoveDownRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export interface PerformanceCardInterface {
    name: string;
    id: string;
    // percentage: string;
}
function PerformanceCard({ name, id }: PerformanceCardInterface) {
    const { push } = useRouter();
    const pathName = usePathname();
    return (
        <div
            className="rounded-xl p-5 border cursor-pointer hover:bg-green-100"
            onClick={() => push(`${pathName}/${id}`)}
        >
            <h1 className="font-semibold text-lg">{name}</h1>
            <div className="flex justify-end  mt-4">
                <div className="flex space-x-3 border px-4 py-3 rounded-xl cursor-pointer  border-green-500 bg-green-100">
                    <div className=" px-[3px] border-2 w-5 h-5 border-green-200 rounded-md flex items-center self-center">
                        <LucideMoveUpRight color="green" size={10} />
                    </div>
                    {/* <p className="text-green-600 font-semibold text-center">
                        {percentage}%
                    </p> */}
                </div>
            </div>
        </div>
    );
}

export default PerformanceCard;
