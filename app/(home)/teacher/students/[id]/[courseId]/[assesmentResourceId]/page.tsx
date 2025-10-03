import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import CheckResource from '@/app/modules/students/CheckResource';
import { getStudentAssessmentAnswerAPI } from '@/app/api/student';

async function CheckResourcePage({
    params,
}: {
    params: { id: string; courseId: string; assesmentResourceId: string };
}) {
    const data: Session | null = await getServerSession(options);
    if (data) {
        try {
            const response = await getStudentAssessmentAnswerAPI({
                accessToken: data?.user?.accessToken,
                studentId: params.id,
                assesmentResourceId: params.assesmentResourceId,
                standardId: params.courseId,
            });

            const APIResponse: any = await response.json();

            if (APIResponse.status !== 'error') {
                return (
                    <section>
                        <CheckResource
                            APIdata={APIResponse.data}
                            studentId={params.id}
                            assesmentResourceId={params.assesmentResourceId}
                            standardId={params.courseId}
                        />
                    </section>
                );
            }

            if (!response.ok) {
                throw new Error(APIResponse?.message!);
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

export default CheckResourcePage;
