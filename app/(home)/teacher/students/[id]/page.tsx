import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { getSummarizedStudentForTeacherAPI } from '@/app/api/student';
import StudentDetails, {
    Student,
} from '@/app/modules/students/StudentDetails/StudentDetails';

interface APIResponse {
    status: string;
    data?: Data;
    message?: string;
}

interface Data {
    student: Student;
    summarizedStandardResults: SummarizedStandardResult[];
}

interface SummarizedStandardResult {
    standardId: string;
    standardName: string;
    totalResources: number;
    finishedResources: number;
}

async function StudentDetailsPage({ params }: { params: { id: string } }) {
    const data: Session | null = await getServerSession(options);

    if (data) {
        try {
            const response = await getSummarizedStudentForTeacherAPI({
                accessToken: data?.user?.accessToken,
                studentId: params.id,
            });

            const APIResponse: APIResponse = await response.json();

            if (!response.ok) {
                throw new Error(APIResponse?.message!);
            }

            if (APIResponse.status !== 'error') {
                return (
                    <section>
                        <StudentDetails APIdata={APIResponse?.data!} />
                    </section>
                );
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

export default StudentDetailsPage;
