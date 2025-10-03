import React from 'react';
import { Session, getServerSession } from 'next-auth';
import { getAllSummarizedStandardsAPI } from '@/app/api/standard';
import { options } from '@/app/api/auth/[...nextauth]/options';
import UnhandledError from '@/app/modules/error/UnhandledError';
import Standard from '@/app/modules/standard/Standard';

type StandardData = {
    id: string;
    name: string;
    courseLength: string;
    totalVideoUploads: string;
    totalNonVideoUploads: string;
    topicCount: string;
};

interface APIData {
    standardsCount: number;
    allStandards: StandardData[];
}

const DEFAULT_ALL_STANDARD_SUMMARY = {
    standardsCount: 0,
    allStandards: [
        {
            id: '',
            name: '',
            courseLength: '',
            totalVideoUploads: '',
            totalNonVideoUploads: '',
            topicCount: '',
        },
    ],
};

async function StandardPage() {
    const data: Session | null = await getServerSession(options);

    let APIdata: APIData = DEFAULT_ALL_STANDARD_SUMMARY;

    if (data) {
        try {
            const response = await getAllSummarizedStandardsAPI({
                accessToken: data?.user?.accessToken,
            });

            const APIResponse = await response.json();

            if (APIResponse.status !== 'error') {
                APIdata = APIResponse?.data;
                const { standardsCount, allStandards } = APIdata;
                return (
                    <Standard
                        standardsCount={standardsCount}
                        allStandards={allStandards}
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

export default StandardPage;
