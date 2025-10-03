import { Metadata } from 'next';
import React from 'react';
import Students from '@/app/modules/students/students';
import { Session, getServerSession } from 'next-auth';
import { SummarizedStudentsAPI } from '@/app/api/student';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';

export const metadata: Metadata = {
    title: 'Students',
    description: 'Here’s all Students',
};

async function StudentPage() {
    const data: Session | any = await getServerSession(options);
    if (data) {
        try {
            const response = await SummarizedStudentsAPI({
                teacherId: data?.user?.id,
                accessToken: data?.user?.accessToken,
            });
            if (response?.status !== 'success') {
                throw new Error(response?.message);
            }
            return <Students data={response?.data} />;
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

export default StudentPage;
