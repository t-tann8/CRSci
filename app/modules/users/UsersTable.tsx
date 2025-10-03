/* eslint-disable react/style-prop-object */

'use client';

import React, { useEffect, useState } from 'react';
import { Eye, Trash } from 'lucide-react';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import EditIcon from '@/app/assets/icons/EditIcon';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import { DEFAULT_IMAGE } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { deleteUserProfileAPI } from '@/app/api/user';
import { toast } from 'react-toastify';
import action from '@/app/action';
import DialogBox from '@/app/components/common/DialogBox';
import ButtonLoader from '@/app/components/common/ButtonLoader';
import ProfileModal from './ProfileModal';

export interface User {
    id: string;
    image: string;
    name: string;
    email: string;
    role: string;
}

interface UsersProp {
    users: User[];
    fontSize?: string;
    isDashboard?: boolean;
    currentPage?: number;
    limit?: number;
    isPending?: boolean;
    handlePageChange?: (page: number) => void;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});

export const DEFAULT_USER = {
    id: '',
    image: DEFAULT_IMAGE,
    name: '',
    email: '',
    role: 'student',
};

function UsersTable({
    users,
    fontSize,
    isDashboard,
    currentPage = 0,
    limit = 0,
    handlePageChange,
    isPending,
}: UsersProp): JSX.Element {
    const { data } = useSession();
    const [isShowProfileModal, setIsShowProfileModal] = useState(false);
    const [isShowDialogBox, setIsShowDialogBox] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>(DEFAULT_USER);

    useEffect(() => {
        if (isShowDialogBox || isShowProfileModal) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isShowDialogBox, isShowProfileModal]);
    const handleOpenProfileModal = (user: User) => {
        setSelectedUser(user);
        setIsShowProfileModal(true);
    };

    const handleCloseProfileModal = () => {
        setIsShowProfileModal(false);
        setSelectedUser(DEFAULT_USER);
    };

    const handleDeleteStudents = async (idToRemove: string) => {
        if (data?.user?.accessToken) {
            try {
                await deleteUserProfileAPI(data?.user?.accessToken, idToRemove);
                if (users?.length === 1 && currentPage > 1) {
                    handlePageChange && handlePageChange(currentPage);
                } else {
                    action('getAllUsers');
                }
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message || 'An Error Occured'
                );
            }
        }
    };

    const handleConfirmDelete = () => {
        setIsShowDialogBox(false);
        handleDeleteStudents(selectedUser?.id);
    };

    const handleCancelDelete = () => {
        setIsShowDialogBox(false);
    };

    return (
        <section>
            <Table
                className={`text-[${fontSize || '18'}px] mobile:text-sm ${
                    poppins.className
                }`}
            >
                <TableHeader>
                    <TableRow>
                        <TableHead className=" text-dark-gray font-bold">
                            SNO.
                        </TableHead>
                        <TableHead className=" text-dark-gray font-bold">
                            Name
                        </TableHead>
                        {!isDashboard && (
                            <TableHead className="text-dark-gray font-bold ">
                                Email
                            </TableHead>
                        )}
                        <TableHead className="text-dark-gray font-bold">
                            Role
                        </TableHead>
                        <TableHead className=" text-dark-gray font-bold">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users?.length > 0 ? (
                        users
                            ?.map((user: User, index: number) => (
                                <TableRow
                                    className="border-none"
                                    key={user?.id}
                                >
                                    <TableCell className="font-medium">
                                        <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                            {currentPage * limit + index + 1}
                                        </span>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <span className="rounded-full flex gap-x-2 items-center">
                                            <Image
                                                src={
                                                    user?.image || DEFAULT_IMAGE
                                                }
                                                alt="crs logo"
                                                width={26}
                                                height={26}
                                                style={{
                                                    width: '26px',
                                                    height: '26px',
                                                    objectFit: 'fill',
                                                    borderRadius: '50%',
                                                }}
                                            />
                                            <span>
                                                {user?.name &&
                                                    user.name
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        user.name.slice(1)}
                                            </span>
                                        </span>
                                    </TableCell>
                                    {!isDashboard && (
                                        <TableCell className="text-dark-gray whitespace-nowrap">
                                            <span className="truncate">
                                                {user?.email}
                                            </span>
                                        </TableCell>
                                    )}
                                    <TableCell className="text-dark-gray">
                                        <span>
                                            {user?.role &&
                                                user.role
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    user.role.slice(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="flex justify-start items-center p-0 mt-3 ml-3">
                                        {isDashboard ? (
                                            <div
                                                className="mr-2 bg-light-orange rounded-md p-1 cursor-pointer flex items-center mt-1"
                                                onClick={() =>
                                                    handleOpenProfileModal(user)
                                                }
                                            >
                                                <Eye
                                                    color="#F59A3B"
                                                    width={18}
                                                    height={18}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex">
                                                <div
                                                    className="mr-2 rounded-md cursor-pointer"
                                                    onClick={() =>
                                                        handleOpenProfileModal(
                                                            user
                                                        )
                                                    }
                                                >
                                                    <EditIcon
                                                        width={28}
                                                        height={28}
                                                    />
                                                </div>
                                                <div
                                                    className="bg-red-100 rounded-md p-1 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsShowDialogBox(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <Trash
                                                        color="#D34645"
                                                        width={18}
                                                        height={18}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                            .slice(0, isDashboard ? 4 : users.length)
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={isDashboard ? 4 : 5}
                                className="text-center"
                            >
                                No User Found!
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                {isPending && (
                    <TableRow>
                        <TableCell
                            colSpan={5}
                            className="h-12 rounded-lg text-center"
                        >
                            <ButtonLoader style="black" />
                        </TableCell>
                    </TableRow>
                )}
            </Table>
            {isShowProfileModal && (
                <div className="fixed right-0 top-0 z-50 md:w-[60%] lg:w-[30%] w-full">
                    <ProfileModal
                        userId={selectedUser?.id}
                        image={selectedUser?.image}
                        name={selectedUser?.name}
                        email={selectedUser?.email}
                        role={selectedUser?.role}
                        isViewOnly={isDashboard}
                        onClose={handleCloseProfileModal}
                    />
                </div>
            )}
            {isShowDialogBox && (
                <DialogBox
                    isOpen={isShowDialogBox}
                    message={`Are you sure you want to delete ${
                        selectedUser?.name || 'this user'
                    }?`}
                    onYes={handleConfirmDelete}
                    onNo={handleCancelDelete}
                />
            )}
        </section>
    );
}

export default UsersTable;
