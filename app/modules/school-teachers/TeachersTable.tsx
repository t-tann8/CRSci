'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Trash } from 'lucide-react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Poppins } from 'next/font/google';
import EditIcon from '@/app/assets/icons/EditIcon';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import Avatar from '@/app/assets/images/UserImage.svg';
import DialogBox from '@/app/components/common/DialogBox';
import { deleteTeacherAPI } from '@/app/api/school';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import action from '@/app/action';
import AssignClassModal from './AssignClassModal';

export interface TeacherInterface {
    id: string;
    imageUrl?: string | StaticImport;
    name: string;
    email: string;
    assignedClasses: string;
}

interface TeacherTableProp {
    teachers: TeacherInterface[];
    fontSize?: string;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});

function TeachersTable({ teachers, fontSize }: TeacherTableProp): JSX.Element {
    const [isEditTeacherModalVisible, setIsEditTeacherModalVisible] =
        useState(false);
    const [teacher, setTeacher] = useState<TeacherInterface | null>(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [buttonLoader, setButtonLoader] = useState(false);
    const { data } = useSession();
    const handleEditTeacherClick = (teacher: TeacherInterface) => {
        setTeacher(teacher);
        setIsEditTeacherModalVisible(true);
    };

    const handleDeleteModal = (teacher: TeacherInterface) => {
        setTeacher(teacher);
        setIsDeleteModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsEditTeacherModalVisible(false);
    };

    // eslint-disable-next-line consistent-return
    const onYes = async () => {
        try {
            setButtonLoader(true);
            const result = await deleteTeacherAPI(
                data?.user.accessToken || '',
                teacher?.id || ''
            );
            if (result.statusCode === 200) {
                setIsDeleteModalVisible(false);
                setTeacher(null);
                action('getListTeacherOfSchool');
                return toast.success('Teacher deleted successfully');
            }
            setIsDeleteModalVisible(false);
            setTeacher(null);
            return toast.error(result.message);
        } catch (error) {
            console.error(error);
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
                            Email
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold">
                            Assigned Classes
                        </TableHead>
                        <TableHead className=" text-dark-gray font-bold">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teachers.length > 0 ? (
                        teachers?.map((teacher, index) => (
                            <TableRow className="border-none" key={teacher.id}>
                                <TableCell className="font-medium">
                                    <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                        {index + 1}
                                    </span>
                                </TableCell>
                                <TableCell className="">
                                    <span className="rounded flex gap-x-2 items-center mr-6">
                                        <Image
                                            src={teacher?.imageUrl || Avatar}
                                            alt="crs logo"
                                            width={26}
                                            height={26}
                                            objectFit="fill"
                                            style={{
                                                width: '26px',
                                                height: '26px',
                                                borderRadius: '50%',
                                            }}
                                        />
                                        <span>{teacher.name}</span>
                                    </span>
                                </TableCell>
                                <TableCell className="text-dark-gray ">
                                    {teacher.email}
                                </TableCell>
                                <TableCell className="text-dark-gray ">
                                    {teacher.assignedClasses}
                                </TableCell>
                                <TableCell className="flex justify-start items-center p-0 mt-3 ml-3 ">
                                    <div
                                        className="mr-2 rounded-md cursor-pointer"
                                        onClick={() =>
                                            handleEditTeacherClick(teacher)
                                        }
                                    >
                                        <EditIcon width={28} height={28} />
                                    </div>
                                    <div
                                        className="bg-red-100 rounded-md p-1 cursor-pointer"
                                        onClick={() =>
                                            handleDeleteModal(teacher)
                                        }
                                    >
                                        <Trash
                                            color="#D34645"
                                            width={18}
                                            height={18}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No Teacher available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {isEditTeacherModalVisible && (
                <div className="fixed right-0 top-0 z-50 w-full md:w-[60%] lg:w-[30%]">
                    <AssignClassModal
                        teacher={teacher}
                        onClose={handleCloseModal}
                    />
                </div>
            )}
            {isDeleteModalVisible && (
                <DialogBox
                    loader={buttonLoader}
                    isOpen={isDeleteModalVisible}
                    message={`Are you sure you want to delete ${
                        teacher?.name || 'this'
                    }?`}
                    onYes={onYes}
                    onNo={() => {
                        setIsDeleteModalVisible(false);
                        setTeacher(null);
                    }}
                />
            )}
        </section>
    );
}

export default TeachersTable;
