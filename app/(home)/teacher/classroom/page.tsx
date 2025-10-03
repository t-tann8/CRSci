import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Classroom from '@/app/modules/classroom/Classroom';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { getSummarizedClassroomsOfTeacherAPI } from '@/app/api/classroom';

async function ClassroomPage() {
    const data: Session | null = await getServerSession(options);
    let APIdata: { id: string; name: string; studentCount: number }[] = [];
    if (data) {
        try {
            const response = await getSummarizedClassroomsOfTeacherAPI({
                accessToken: data?.user.accessToken,
                teacherId: data?.user.id,
            });

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                APIdata = APIResponse?.data;
                return <Classroom summarizedClassrooms={APIdata} />;
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

    return <Classroom summarizedClassrooms={APIdata} />;
}

export default ClassroomPage;
