import React from 'react';
import { Session, getServerSession } from 'next-auth';
import Profile from '@/app/modules/profile/Profile';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import { getStudentProfileSummarizedStandardsAPI } from '@/app/api/student';

interface APIResponse {
    status: string;
    data?: {
        summarizedStandardResults: SummarizedStandardResult[];
        averageTotalWeightage: number;
        averageObtainedWeightage: number;
        classroomName: string;
        bestPerformingStandard: BestPerformingStandard;
    };
    message?: string;
}

interface SummarizedStandardResult {
    standardId: string;
    standardName: string;
    totalWeightage: number;
    obtainedWeightage: number;
}

interface BestPerformingStandard {
    standardId: string;
    standardName: string;
    obtainedWeightage: number;
}

async function ProfilePage() {
    const data: Session | null = await getServerSession(options);

    if (data) {
        try {
            const response = await getStudentProfileSummarizedStandardsAPI({
                accessToken: data?.user?.accessToken,
                studentId: data?.user?.id,
            });

            const APIResponse: APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                return (
                    <section>
                        <Profile APIdata={APIResponse?.data!} />
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

export default ProfilePage;
