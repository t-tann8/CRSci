import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { getAssessmentAnswerToCreateOrEditAPI } from '@/app/api/assignment';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import S3DocxEditor from '@/app/modules/learning/create-assignment/CreateAssignment';

interface APIData {
    name: string;
    documentURL: string;
    answerURL: string;
    totalMarks: number;
    obtainedMarks: number;
    canWrite: boolean;
    deadline: string;
}

async function DetailsPage({
    params,
}: {
    params: { id: string; resourceId: string };
}) {
    const data: Session | null = await getServerSession(options);

    let APIdata: APIData = {
        name: '',
        documentURL: '',
        answerURL: '',
        totalMarks: 0,
        obtainedMarks: -1,
        canWrite: false,
        deadline: '',
    };

    if (data) {
        try {
            const response = await getAssessmentAnswerToCreateOrEditAPI({
                accessToken: data?.user?.accessToken,
                userId: data?.user?.id,
                resourceId: params.resourceId,
                standardId: params.id,
            });

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                APIdata = APIResponse?.data;
                const {
                    name,
                    documentURL,
                    answerURL,
                    totalMarks,
                    obtainedMarks,
                    canWrite,
                    deadline,
                } = APIdata;
                return (
                    <S3DocxEditor
                        documentURL={answerURL || documentURL}
                        attempted={!!answerURL}
                        resourceId={params.resourceId}
                        name={name}
                        canWrite={canWrite}
                        deadline={deadline}
                        standardId={params.id}
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

export default DetailsPage;
