'use client';

import { useRouter, usePathname } from 'next/navigation';
import React from 'react';
import { Eye, Trash } from 'lucide-react';
import { Poppins } from 'next/font/google';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import EditIcon from '@/app/assets/icons/EditIcon';

export interface TopicsInterface {
    topic: string;
    id: number;
    assignedResources: string;
}

export interface TopicsProp {
    topics: TopicsInterface[];
    fontSize?: string;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});
function TopicsTable({ topics, fontSize }: TopicsProp) {
    const { push } = useRouter();
    const pathname = usePathname();

    const handleClick = (id: number) => {
        push(`${pathname}/${id}`);
    };

    return (
        <Table
            className={`text-[${fontSize || '18'}px] mobile:text-sm ${
                poppins.className
            }`}
        >
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px] text-dark-gray font-bold">
                        SNO.
                    </TableHead>
                    <TableHead className="text-dark-gray font-bold">
                        Topic
                    </TableHead>
                    <TableHead className="text-dark-gray font-bold ">
                        Assigned Resource
                    </TableHead>
                    <TableHead className="text-dark-gray items-center font-bold lg:flex lg:justify-end lg:pr-16">
                        Action
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {topics.map((resource, index) => (
                    <TableRow className="border-none" key={resource.id}>
                        <TableCell className="font-medium">
                            <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                {index + 1}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span>{resource.topic}</span>
                        </TableCell>

                        <TableCell className="text-dark-gray ">
                            {resource.assignedResources}
                        </TableCell>

                        <TableCell className="flex lg:justify-end items-center p-0 mt-5  lg:pr-10">
                            <div
                                className="mr-2 bg-light-orange rounded-md p-1 cursor-pointer"
                                onClick={() => handleClick(resource.id)}
                            >
                                <Eye color="#F59A3B" width={18} height={18} />
                            </div>
                            <div
                                className="mr-2 bg-green-100 rounded-md p-1 cursor-pointer "
                                // onClick={() => handleClick(index)}
                            >
                                <EditIcon
                                    color="#F59A3B"
                                    width={22}
                                    height={22}
                                />
                            </div>
                            <div className="bg-red-100 rounded-md p-1">
                                <Trash color="#D34645" width={18} height={18} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
export default TopicsTable;
