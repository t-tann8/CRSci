import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { getClassroomStudentsAPI } from '@/app/api/classroom';
import ClassroomStudents from '@/app/modules/classroom/ClassroomStudents';

async function ClassroomStudentsPage({
    params,
    searchParams,
}: {
    params: { classId: string };
    searchParams: { [key: string]: string | undefined };
}) {
    const data: Session | null = await getServerSession(options);
    const { page = '1' } = searchParams;
    let APIdata: {
        className: string;
        totalPages: number;
        students: {
            id: string;
            index: number;
            name: string;
            image: string;
            email: string;
            grade: string;
            performance: number;
            gradeId: string;
        }[];
    } = {
        className: 'Class',
        totalPages: 1,
        students: [],
    };

    if (data) {
        try {
            const response = await getClassroomStudentsAPI({
                accessToken: data?.user.accessToken,
                classroomId: params?.classId,
                page: parseInt(page, 10),
                limit: 10,
            });

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                APIdata = APIResponse?.data;
                return (
                    <ClassroomStudents
                        className={APIdata.className}
                        totalPages={APIdata.totalPages}
                        students={APIdata.students}
                    />
                );
            }

            if (!response.ok) {
                throw new Error(APIResponse?.message);
            }
        } catch (error: any) {
            return (
                <UnhandledError
                    error={{
                        message: error?.message,
                        name: error?.name,
                    }}
                />
            );
        }
    }

    return (
        <ClassroomStudents
            className={APIdata.className}
            totalPages={APIdata.totalPages}
            students={APIdata.students}
        />
    );
}

export default ClassroomStudentsPage;
