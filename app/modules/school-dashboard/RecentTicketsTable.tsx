import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { Poppins } from 'next/font/google';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import ViewTicketModal from './ViewTicketModal';

export interface TicketsInterface {
    id: number;
    name: string;
    date: string;
    status: string;
}

interface TicketsProp {
    tickets: TicketsInterface[];
    fontSize?: string;
    isDashboard?: boolean;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});

function TicketsTable({
    tickets,
    fontSize,
    isDashboard,
}: TicketsProp): JSX.Element {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] =
        useState<TicketsInterface | null>(null);

    function getStatusColorClass(status: string) {
        switch (status.toLocaleLowerCase()) {
            case 'active':
                return 'text-green-500';
            case 'inprogress':
                return 'text-sky-400';
            case 'closed':
                return 'text-red-500';
            default:
                return '';
        }
    }

    const handleClick = (ticket: TicketsInterface) => {
        setSelectedTicket(ticket);
        setModalVisible(true);
    };

    useEffect(() => {
        if (modalVisible) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [modalVisible]);

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTicket(null);
    };

    return (
        <>
            <Table
                className={`text-[${
                    fontSize || '18'
                }px] mobile:text-sm whitespace-nowrap  ${poppins.className}`}
            >
                <TableHeader>
                    <TableRow>
                        <TableHead className=" text-dark-gray font-bold">
                            SNO.
                        </TableHead>
                        <TableHead className=" text-dark-gray font-bold">
                            Name
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold">
                            Date
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold">
                            Status
                        </TableHead>
                        <TableHead className=" text-dark-gray font-bold">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets?.length > 0 ? (
                        tickets?.map((ticket, index) => (
                            <TableRow className="border-none" key={ticket.id}>
                                <TableCell className="font-medium">
                                    <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                        {index + 1}
                                    </span>
                                </TableCell>
                                <TableCell className="">
                                    <span className="rounded flex gap-x-2 items-center ">
                                        <span className="truncate h-[26px]">
                                            {ticket.name}
                                        </span>
                                    </span>
                                </TableCell>
                                <TableCell className="text-dark-gray">
                                    {
                                        new Date(ticket.date)
                                            .toISOString()
                                            .split('T')[0]
                                    }
                                </TableCell>

                                <TableCell
                                    className={`text-dark-gray font-medium ${getStatusColorClass(
                                        ticket.status
                                    )}`}
                                >
                                    {ticket.status.charAt(0).toUpperCase() +
                                        ticket.status.slice(1)}
                                </TableCell>

                                <TableCell className="flex lg:justify-end items-center p-0 mt-4 lg:pr-10 ">
                                    <div
                                        className="mr-2 bg-light-orange rounded-md p-1 cursor-pointer"
                                        onClick={() => handleClick(ticket)}
                                    >
                                        <Eye
                                            color="#F59A3B"
                                            width={18}
                                            height={18}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell className="text-center" colSpan={5}>
                                No Tickets Found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {modalVisible && selectedTicket && (
                <div className="fixed right-0 top-0 z-50 w-[100%] md:w-[60%] lg:w-[30%]">
                    <ViewTicketModal
                        ticket={selectedTicket}
                        onClose={closeModal}
                        ticketDetails={selectedTicket}
                    />
                </div>
            )}
        </>
    );
}

export default TicketsTable;
