import { Metadata } from 'next';
import React from 'react';
import { Session, getServerSession } from 'next-auth';
import Teachers from '@/app/modules/school-teachers/Teachers';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { getListTeacherOfSchool } from '@/app/api/school';

export const metadata: Metadata = {
    title: 'Teachers',
    description: 'All Teacher in your School',
};

interface APIUserInterface {
    id: string;
    name: string;
    email: string;
    image: string;
}

interface APITeacherInterface {
    classroomCount: string;
    User: APIUserInterface;
}

interface APIPaginationInterface {
    totalRecords: number;
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

interface ListTeacherResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        teachers: APITeacherInterface[];
        pagination: APIPaginationInterface;
    };
}

async function TeachersPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const { page = '1', search = '' } = searchParams;

    const data: Session | null = await getServerSession(options);

    if (data) {
        try {
            const response = await getListTeacherOfSchool({
                accessToken: data?.user?.accessToken,
                schoolId: data?.user?.schoolId || '',
                page,
                limit: 10,
                search,
            });

            const APIResponse: ListTeacherResponse = await response.json();

            if (APIResponse.status !== 'error') {
                const APIdata = APIResponse?.data;
                return (
                    <Teachers
                        teachers={APIdata.teachers}
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

export default TeachersPage;
