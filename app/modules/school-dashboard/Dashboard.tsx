'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DataIcon from '@/app/assets/icons/DataIcon';
import UserIcon from '@/app/assets/icons/UserIcon';
import WavingHandIcon from '@/app/assets/icons/WavingHand';
import SchoolClassroomIcon from '@/app/assets/icons/SchoolClassroomIcon';
import DashboardGraph from '@/app/components/common/DashboardGraph';
import Card from '../../components/common/Card';
import Searchbar from '../../components/common/Searchbar';
// import TicketsTable from './RecentTicketsTable';
import SubmitTicketModal from './SubmitTicketModal';
import AddClassroomModal from './AddClassroomModal';
import UsersTable from '../users/UsersTable';

function SchoolDashboard({ data, name }: { data: any; name: string }) {
    const [isDisplayTicketModal, setIsDisplayTicketModal] = useState(false);
    const [currentYear, setCurrentYear] = React.useState(
        new Date().getFullYear()
    );

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setCurrentYear(+e.target.value);
    }
    // const handleDisplayTicketModal = () => {
    //     setIsDisplayTicketModal(true);
    // };

    const handleCloseModal = () => {
        setIsDisplayTicketModal(false);
    };

    useEffect(() => {
        if (isDisplayTicketModal) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isDisplayTicketModal]);

    // const tickets = data?.getSchoolTickets?.map((ticket: any) => ({
    //     ...ticket,
    //     id: ticket.id,
    //     name: ticket?.User?.name,
    //     date: ticket.createdAt,
    //     status: ticket.status,
    // }));

    return (
        <section className="flex flex-col w-full scroll-smooth  lg:px-4 ">
            <Searchbar
                headerText={`Hello ${name}!`}
                tagline="Here’s a Quick Overview"
                Icon={WavingHandIcon}
            />
            <div className="grid mobile:grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mobile:mt-10 mt-4 mobile:place-items-center mb-4">
                <Card
                    Icon={UserIcon}
                    cardText="Total Students"
                    count={data?.totalStudent}
                    isSchool
                />
                <Card
                    Icon={SchoolClassroomIcon}
                    cardText="No of Classroom"
                    count={data?.totalClassroom}
                    isSchool
                />

                <Card
                    Icon={DataIcon}
                    cardText="Overall Performance"
                    count={`${
                        data?.obtainedWeightage !== undefined &&
                        data?.totalWeightage !== 'NaN'
                            ? `${data.obtainedWeightage} of ${data.totalWeightage}%`
                            : '0 of 0%'
                    }`}
                    isSchool
                />
            </div>
            <div className="flex justify-between items-center my-3">
                <h3 className="text-xl font-semibold mobile:mb-2">
                    All Users Count
                </h3>
                <select
                    className=" select-wrapper"
                    onChange={handleChange}
                    value={currentYear}
                >
                    <option value={new Date().getFullYear()}>
                        {new Date().getFullYear()}
                    </option>
                    <option value={new Date().getFullYear() - 1}>
                        {new Date().getFullYear() - 1}
                    </option>
                    <option value={new Date().getFullYear() - 2}>
                        {new Date().getFullYear() - 2}
                    </option>
                </select>
            </div>
            <div className="w-full ">
                <DashboardGraph data={data?.usersJoining} year={currentYear} />
            </div>
            {/* <div className=" grid grid-cols-1 lg:grid-cols-2 items-start gap-4 mt-5 "> */}
            <div className="border rounded-lg p-5 px-2 lg:px-5 mt-5 ">
                <div className="flex  justify-between px-1 mb-2   items-center">
                    <h1 className="text-xl font-semibold">Teacher&apos;s</h1>
                    <Link href="/school/teachers">
                        <div className="cursor-pointer border rounded-lg px-3 py-2 text-dark-gray font-medium mobile:mt-2 hover:bg-primary-color hover:text-white">
                            Show All
                        </div>
                    </Link>
                </div>
                <UsersTable
                    users={data?.getSchoolTeacher}
                    fontSize="12"
                    isDashboard
                />
            </div>
            {/* <div className="border rounded-lg p-5 px-2 lg:px-5 mt-2 lg:mt-0">
                    <div className="flex  justify-between px-1 mb-2   items-center">
                        <h1 className="text-xl font-semibold">
                            Recent Tickets
                        </h1>
                        <div
                            className="cursor-pointer border rounded-lg px-3 py-2 mobile:mt-2 text-dark-gray font-medium hover:bg-primary-color hover:text-white"
                            onClick={handleDisplayTicketModal}
                        >
                            New Ticket
                        </div>
                    </div>
                    <TicketsTable tickets={tickets} fontSize="12" />
                </div> */}
            {/* </div> */}

            {isDisplayTicketModal && (
                <div className="fixed top-0 right-0 z-50 w-full lg:w-[30%]">
                    <SubmitTicketModal onClose={handleCloseModal} />
                </div>
            )}
        </section>
    );
}

export default SchoolDashboard;
