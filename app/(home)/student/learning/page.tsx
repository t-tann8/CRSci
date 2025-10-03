import React from 'react';
import Learning from '@/app/modules/learning/Learning';
import { Session, getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { getStudentCurrentStandardsAPI } from '@/app/api/student';

type StandardData = {
    id: string;
    name: string;
    courseLength: string;
    totalVideoUploads: string;
    totalNonVideoUploads: string;
};

type APIData = StandardData[];

const DEFAULT_ALL_STANDARD_SUMMARY = [
    {
        id: '',
        name: '',
        courseLength: '',
        totalVideoUploads: '',
        totalNonVideoUploads: '',
    },
];

async function LearningPage() {
    const data: Session | null = await getServerSession(options);

    let APIdata: APIData = DEFAULT_ALL_STANDARD_SUMMARY;

    if (data) {
        try {
            const response = await getStudentCurrentStandardsAPI({
                accessToken: data?.user?.accessToken,
                studentId: data?.user?.id,
            });

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                APIdata = APIResponse?.data;
                return <Learning standards={APIdata} />;
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

export default LearningPage;
