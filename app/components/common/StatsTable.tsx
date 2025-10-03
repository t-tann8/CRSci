import React from 'react';
import { Poppins } from 'next/font/google';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';

export interface StatsInterface {
    id: string;
    name: string;
    first: number;
    second: number;
    third: number;
    forth: number;
    fifth?: number;
}

interface StatsTableProps {
    statsList: StatsInterface[];
    fontSize?: string;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});
function StatsTable({ statsList, fontSize }: StatsTableProps) {
    return (
        <Table
            className={`text-[${fontSize || '18'}px] mobile:text-sm   ${
                poppins.className
            }`}
        >
            <TableHeader>
                <TableRow>
                    <TableHead className=" text-dark-gray font-bold">
                        Standard
                    </TableHead>
                    <TableHead className="text-dark-gray font-bold ">
                        0-25
                    </TableHead>
                    <TableHead className="text-dark-gray font-bold ">
                        25-50
                    </TableHead>
                    <TableHead className="text-dark-gray font-bold ">
                        50-75
                    </TableHead>
                    <TableHead className="text-dark-gray font-bold ">
                        75-100
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {statsList?.length > 0 ? (
                    statsList?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.first}</TableCell>
                            <TableCell>{item.second}</TableCell>
                            <TableCell>{item.third}</TableCell>
                            <TableCell>{item.forth}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">
                            No Standard Found!
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
export default StatsTable;
