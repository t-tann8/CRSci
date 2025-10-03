import React from 'react';
import { Metadata } from 'next';
import { Session, getServerSession } from 'next-auth';
import { getSchoolClassroomsAPI } from '@/app/api/classroom';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import Classrooms from '@/app/modules/school-classrooms/Classrooms';

export const metadata: Metadata = {
    title: 'Classrooms',
    description: 'All Classrooms in your School',
};

interface APIClassroomsInterface {
    id: string;
    name: string;
    teacher: string;
    status: string;
}

interface APIPaginationInterface {
    currentPage: number;
    totalPages: number;
}

interface ListTeacherResponse {
    status: string;
    message?: string;
    data: {
        classrooms: APIClassroomsInterface[];
        pagination: APIPaginationInterface;
    };
}

async function ClassroomsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const { page = '1', search = '' } = searchParams;

    const data: Session | null = await getServerSession(options);

    if (data) {
        try {
            const response = await getSchoolClassroomsAPI({
                accessToken: data?.user?.accessToken,
                schoolId: data?.user?.schoolId || '',
                page: parseInt(page, 10),
                limit: 10,
                search,
            });

            const APIResponse: ListTeacherResponse = await response.json();

            if (APIResponse.status !== 'error') {
                const APIdata = APIResponse?.data;
                return (
                    <Classrooms
                        classrooms={APIdata.classrooms}
                        pagination={APIdata.pagination}
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
}

export default ClassroomsPage;
