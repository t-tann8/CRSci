'use client';

import Image from 'next/image';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { Eye, Trash } from 'lucide-react';
import { Poppins } from 'next/font/google';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import action from '@/app/action';
import { DEFAULT_IMAGE } from '@/lib/utils';
import EditIcon from '@/app/assets/icons/EditIcon';
import DialogBox from '@/app/components/common/DialogBox';
import PageLoader from '@/app/components/common/PageLoader';
import { removeStudentFromClassroomAPI } from '@/app/api/classroom';
import ClassroomModal, {
    StudentInfoInterface,
} from '../classroom/ClassroomModal';

const DEFAULT_CLASSROOM_STUDENT = {
    id: '0',
    index: 0,
    name: 'Name',
    email: 'name@gmail.com',
    image: DEFAULT_IMAGE,
    classroomStudentId: '0',
    totalFinishedResources: 0,
    totalResourcesCount: 0,
    grade: 'Grade',
    gradeId: '0',
};

export interface StudentsInfoProp {
    students: StudentInfoInterface[];
    fontSize?: string;
    isClassroomTable?: boolean;
    isTeacherDashboardTable?: boolean;
    currentPage?: number;
    handlePageChange?: (page: number) => void;
    isTeacher?: boolean;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});

function StudentsInfoTable({
    students,
    fontSize,
    isClassroomTable,
    isTeacherDashboardTable,
    currentPage = 0,
    handlePageChange,
    isTeacher,
}: StudentsInfoProp) {
    const { push } = useRouter();
    const { data, status } = useSession();
    const [disableButton, setDisableButton] = useState(false);
    const [isShowDialogBox, setIsShowDialogBox] = useState(false);
    const [isShowStudentModal, setIsShowStudentModal] = useState(false);
    const [selectedStudent, setSelectedStudent] =
        useState<StudentInfoInterface>(DEFAULT_CLASSROOM_STUDENT);

    const handleOpenStudentModal = (user: StudentInfoInterface) => {
        setSelectedStudent(user);
        setIsShowStudentModal(true);
    };

    const handleCloseStudentModal = () => {
        setIsShowStudentModal(false);
        setSelectedStudent(DEFAULT_CLASSROOM_STUDENT);
    };

    const handleDeleteStudents = async (idToRemove: string) => {
        if (data?.user?.accessToken) {
            try {
                setDisableButton(true);
                const APIresponse = await removeStudentFromClassroomAPI({
                    accessToken: data?.user?.accessToken,
                    classroomStudentId: idToRemove,
                });

                if (APIresponse.status !== 200) {
                    throw new Error(APIresponse?.data?.message);
                }

                toast.success('Student removed from the class successfully');

                if (students?.length === 1 && currentPage > 1) {
                    handlePageChange && handlePageChange(currentPage - 1);
                } else {
                    action('getClassroomStudents');
                }
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message || 'An Error Occured'
                );
            } finally {
                setDisableButton(false);
            }
        }
    };

    const handleConfirmDelete = () => {
        setIsShowDialogBox(false);
        handleDeleteStudents(selectedStudent?.classroomStudentId || '');
    };

    const handleCancelDelete = () => {
        setIsShowDialogBox(false);
    };

    const handleClick = (id: string) => {
        push(`/teacher/students/${id}`);
    };

    return status === 'loading' ? (
        <PageLoader />
    ) : (
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
                        <TableHead className="text-dark-gray font-bold">
                            Name
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold pl-12">
                            Email
                        </TableHead>
                        {!isTeacherDashboardTable && (
                            <TableHead className="text-dark-gray font-bold">
                                Grade
                            </TableHead>
                        )}
                        {isClassroomTable || isTeacherDashboardTable ? (
                            <TableHead className="text-dark-gray font-bold">
                                Performance
                            </TableHead>
                        ) : (
                            <TableHead className="text-dark-gray font-bold">
                                Completed Resources
                            </TableHead>
                        )}
                        <TableHead className="text-dark-gray font-bold">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                {students && students[0] ? (
                    <TableBody>
                        {students.map((student, index) => (
                            <TableRow className="border-none" key={student.id}>
                                <TableCell className="font-medium">
                                    <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                        {index + 1}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="rounded flex gap-x-2 items-center">
                                        <Image
                                            src={student.image || DEFAULT_IMAGE}
                                            width={30}
                                            height={30}
                                            alt="user"
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                objectFit: 'fill',
                                                borderRadius: '50%',
                                            }}
                                        />
                                        <span>{student.name}</span>
                                    </span>
                                </TableCell>

                                <TableCell className="text-dark-gray pl-12">
                                    {student.email}
                                </TableCell>
                                {!isTeacherDashboardTable && (
                                    <TableCell className="text-dark-gray">
                                        {student.grade}
                                    </TableCell>
                                )}
                                {isClassroomTable || isTeacherDashboardTable ? (
                                    <TableCell className="text-dark-gray">
                                        {student.performance} %
                                    </TableCell>
                                ) : (
                                    <TableCell className="text-dark-gray">
                                        {`${student.totalFinishedResources} / ${student.totalFinishedResources}`}
                                    </TableCell>
                                )}
                                <TableCell className="flex justify-start space-x-2 items-center p-0 mt-5 ml-3">
                                    {!isClassroomTable && (
                                        <div
                                            className=" bg-light-orange rounded-md p-1 cursor-pointer"
                                            onClick={() =>
                                                !isClassroomTable
                                                    ? handleClick(student.id)
                                                    : handleOpenStudentModal(
                                                          student
                                                      )
                                            }
                                        >
                                            <Eye
                                                color="#F59A3B"
                                                width={18}
                                                height={18}
                                            />
                                        </div>
                                    )}
                                    {!isTeacherDashboardTable && (
                                        <div
                                            className="bg-green-100 rounded-md p-1 cursor-pointer"
                                            onClick={() =>
                                                handleOpenStudentModal(student)
                                            }
                                        >
                                            <EditIcon width={22} height={22} />
                                        </div>
                                    )}
                                    {(!isTeacherDashboardTable ||
                                        isTeacher) && (
                                        <div
                                            className={`bg-red-100 rounded-md p-1 cursor-pointer ${
                                                disableButton
                                                    ? 'opacity-50'
                                                    : ''
                                            }`}
                                            onClick={() => {
                                                if (!disableButton) {
                                                    setSelectedStudent(student);
                                                    setIsShowDialogBox(true);
                                                }
                                            }}
                                        >
                                            <Trash
                                                color="#D34645"
                                                width={18}
                                                height={18}
                                            />
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                ) : (
                    <TableCell colSpan={6} className="text-center">
                        No Student Found!
                    </TableCell>
                )}
            </Table>
            {isShowStudentModal && (
                <div className="fixed right-0 top-0 z-50 w-[100%] md:w-[60%] lg:w-[30%]">
                    <ClassroomModal
                        data={data}
                        student={selectedStudent}
                        onClose={handleCloseStudentModal}
                    />
                </div>
            )}
            {isShowDialogBox && (
                <DialogBox
                    isOpen={isShowDialogBox}
                    message={`Are you sure you want to remove ${
                        selectedStudent?.name || 'this student'
                    } from class ${selectedStudent.grade} ?`}
                    onYes={handleConfirmDelete}
                    onNo={handleCancelDelete}
                />
            )}
        </section>
    );
}
export default StudentsInfoTable;
