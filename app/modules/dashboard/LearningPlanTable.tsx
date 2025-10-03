'use client';

import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
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
import { LearningInterface } from '@/lib/utils';
import { deleteClassCourseAPI } from '@/app/api/classroom';
import DialogBox from '@/app/components/common/DialogBox';

interface LearningPlanProp {
    learnings: LearningInterface[];
    fontSize?: string;
}

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '400', '700'],
});
function LearningPlanTable({ learnings, fontSize }: LearningPlanProp) {
    const { push } = useRouter();
    const { data } = useSession();
    const [isShowDialogBox, setIsShowDialogBox] = React.useState(false);
    const [selectedLearning, setSelectedLearning] =
        React.useState<LearningInterface | null>(null);

    useEffect(() => {
        if (isShowDialogBox) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isShowDialogBox]);

    const handleModal = (learning: LearningInterface) => {
        setSelectedLearning(learning);
        setIsShowDialogBox(true);
    };
    const handleDeleteClassStandard = async (classStandardId: string) => {
        try {
            await deleteClassCourseAPI({
                accessToken: data?.user.accessToken || '',
                classroomCourseId: classStandardId,
            });
            action('getClassesAndCourses');
            toast.success('Standard removed from class successfully.');
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    'An error occured while removing standard from class.'
            );
        } finally {
            setIsShowDialogBox(false);
            setSelectedLearning(null);
        }
    };

    const handleCancelDelete = () => {
        setIsShowDialogBox(false);
        setSelectedLearning(null);
    };

    return (
        <>
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
                            Plan Name
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold">
                            Grade
                        </TableHead>
                        <TableHead className="text-dark-gray font-bold">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {learnings && learnings.length > 0 ? (
                        learnings.map((learning, index) => (
                            <TableRow className="border-none" key={learning.id}>
                                <TableCell className="font-medium">
                                    <span className="bg-light-gray px-[7px] py-[4px] rounded-md">
                                        {index + 1}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="flex gap-x-2 items-center">
                                        <span className="truncate h-[30px]">
                                            {learning.standardName}
                                        </span>
                                    </span>
                                </TableCell>
                                <TableCell className="text-dark-gray">
                                    {learning.className}
                                </TableCell>
                                <TableCell className="flex justify-start items-center p-0 mt-3 ml-3">
                                    <div
                                        className="mr-2 bg-light-orange rounded-md p-1 cursor-pointer"
                                        onClick={() => {
                                            const newPath = `teacher/learning-plans/${learning.standardId}`;
                                            push(newPath);
                                        }}
                                    >
                                        <Eye
                                            color="#F59A3B"
                                            width={18}
                                            height={18}
                                        />
                                    </div>
                                    <div
                                        className="bg-red-100 rounded-md p-1 cursor-pointer"
                                        onClick={() => {
                                            handleModal(learning);
                                        }}
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
                                No Learning Plan Found!
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {isShowDialogBox && (
                <DialogBox
                    isOpen={isShowDialogBox}
                    message={`Are you sure you want to delete ${
                        selectedLearning?.standardName || 'this standard'
                    } from ${selectedLearning?.className}?`}
                    onYes={() =>
                        handleDeleteClassStandard(selectedLearning?.id || '')
                    }
                    onNo={handleCancelDelete}
                />
            )}
        </>
    );
}
export default LearningPlanTable;
