'use client';

import action from '@/app/action';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import ButtonLoader from '@/app/components/common/ButtonLoader';
import { assignMarksToStudentAnswerAPI } from '@/app/api/student';

function CheckResource({
    APIdata,
    studentId,
    assesmentResourceId,
    standardId,
}: {
    APIdata: any;
    studentId: string;
    assesmentResourceId: string;
    standardId: string;
}) {
    const { data } = useSession();
    const [marks, setMarks] = useState(
        APIdata?.assessmentAnswer?.assessmentAnswers[0].obtainedMarks || 0
    );
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const url = APIdata?.assessmentAnswer?.assessmentAnswers[0].answerURL;

    const onSubmit = async () => {
        if (!data) {
            return;
        }

        try {
            setButtonLoading(true);
            const response = await assignMarksToStudentAnswerAPI({
                studentId,
                accessToken: data?.user?.accessToken || '',
                targetType: 'assessmentResource',
                idsAndMarks: { [assesmentResourceId]: marks },
                standardId,
            });
            if (response.status !== 200) {
                toast.error(
                    response?.data?.message ||
                        'An Error occured while assigning marks'
                );
            }
            await action('getStudentAssessmentAnswer');
            toast.success(`Marks assigned successfully`);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    'An Error occured while assigning marks'
            );
        } finally {
            setButtonLoading(false);
        }
    };

    return (
        <>
            {' '}
            <Label className=" text-lg mb-1">
                Total Marks: {APIdata?.assessmentAnswer?.totalMarks}{' '}
            </Label>
            <div className="flex gap-2">
                <Input
                    type="number"
                    className="!w-1/2"
                    placeholder="Marks Obtained"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                />
                <Button onClick={onSubmit}>
                    {buttonLoading ? <ButtonLoader /> : 'Submit'}
                </Button>
            </div>
            <div className="w-full mt-5 h-screen flex flex-col justify-center items-center">
                <iframe
                    title="Answer"
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                        url as string
                    )}`}
                    width="100%"
                    height="100%"
                    loading="lazy"
                />
            </div>
        </>
    );
}

export default CheckResource;
