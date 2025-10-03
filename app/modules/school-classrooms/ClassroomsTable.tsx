'use client';

import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { Circle } from 'lucide-react';
import { Poppins } from 'next/font/google';
import { useSession } from 'next-auth/react';
import action from '@/app/action';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import { changeClassStatusAPI } from '@/app/api/classroom';

interface APIClassroomsInterface {
    id: string;
    name: string;
    teacher: string;
    status: string;
}

interface TeacherTableProp {
    classrooms: APIClassroomsInterface[];
    fontSize?: string;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});

function ClassroomsTable({
    classrooms,
    fontSize,
}: TeacherTableProp): JSX.Element {
    const [buttonLoader, setButtonLoader] = useState(false);
    const { data } = useSession();

    const handleUpdateClassStatus = async (
        classroom: APIClassroomsInterface
        // eslint-disable-next-line consistent-return
    ) => {
        try {
            if (data) {
                setButtonLoader(true);
                const APIresponse = await changeClassStatusAPI({
                    accessToken: data?.user.accessToken || '',
                    schoolId: data?.user.schoolId || '',
                    classroomId: classroom?.id || '',
                    status:
                        classroom?.status === 'active' ? 'inactive' : 'active',
                });
                if (APIresponse.status === 200) {
                    action('getSchoolClassrooms');
                    return toast.success(
                        'Classroom Status Updated Successfully'
                    );
                }
            }
            return null;
        } catch (error: any) {
            console.log(error);
            toast.error(
                error?.response?.data?.message ||
                    'Error Updating Status Of Classroom'
            );
        } finally {
            setButtonLoader(false);
        }
    };
    return (
        <section>
            <Table
                className={`text-[${
                    fontSize || '18'
                }px] mobile:text-sm whitespace-nowrap ${poppins.className}`}
            >
                <TableHeader>
                    <TableRow>
                        <TableHead className=" text-dark-gray font-bold">
                            SNO.
                        </TableHead>
                        <TableHead className="w-[200px] flex space-x-1 text-dark-gray items-center font-bold">
                            <span className="hidden lg:block"> Teacher</span>
                            <span>Name</span>
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold">
                            Teacher
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
                    {classrooms?.length > 0 ? (
                        classrooms?.map((classroom, index) => (
                            <TableRow
                                className="border-none"
                                key={classroom.id}
                            >
                                <TableCell className="font-medium">
                                    <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                        {index + 1}
                                    </span>
                                </TableCell>
                                <TableCell className="text-dark-gray ">
                                    {classroom.name}
                                </TableCell>
                                <TableCell className="text-dark-gray ">
                                    {classroom.teacher}
                                </TableCell>
                                <TableCell className="text-dark-gray ">
                                    {classroom.status}
                                </TableCell>
                                <TableCell>
                                    <button
                                        className={`${
                                            buttonLoader
                                                ? 'bg-orange-100 '
                                                : classroom?.status === 'active'
                                                  ? 'bg-green-100 '
                                                  : 'bg-red-100 '
                                        } p-2 w-8 rounded-xl`}
                                        onClick={() =>
                                            handleUpdateClassStatus(classroom)
                                        }
                                        type="button"
                                        disabled={buttonLoader}
                                    >
                                        {buttonLoader ? (
                                            <Circle
                                                size={15}
                                                color="orange"
                                                fill="orange"
                                            />
                                        ) : classroom?.status === 'active' ? (
                                            <Circle
                                                size={15}
                                                color="green"
                                                fill="green"
                                            />
                                        ) : (
                                            <Circle
                                                size={15}
                                                color="red"
                                                fill="red"
                                            />
                                        )}
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No Classroom Available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </section>
    );
}

export default ClassroomsTable;
