'use client';

import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import action from '@/app/action';
import ModalFooter from '@/app/components/common/ModalFooter';
import { assignMarksToStudentAnswerAPI } from '@/app/api/student';
import { Button } from '@/app/components/ui/button';
import { Label } from '@radix-ui/react-label';

interface DailyUpload {
    id: string;
    accessDate: string;
    weightage: number;
    resource: Resource;
    accessible: boolean;
    performance: number;
    yetToMarkWeightage: number;
    unAnsweredWeightage: number;
}

interface Resource {
    id: string;
    name: string;
    type: string;
    video: Video | null;
    AssessmentResourcesDetail: AssessmentDetail | null;
}

interface Video {
    id: string;
    questions: Question[];
}

interface Question {
    id: string;
    statement: string;
    totalMarks: number;
    answers: Answer[];
    options?: { [key: string]: string };
    correctOption?: string;
    correctOptionExplanation?: string;
}

interface Answer {
    obtainedMarks: number;
    answer?: string;
}

interface AssessmentDetail {
    id: string;
    totalMarks: number;
    deadline: number;
    assessmentAnswers: AssessmentAnswer[];
}

interface AssessmentAnswer {
    obtainedMarks: number;
    answerURL: string;
}

interface FormData {
    [key: string]: number; // Key is question/assessment ID, value is obtained marks
}

function TestReportModal({
    onClose,
    test,
}: {
    onClose: () => void;
    test: DailyUpload;
}) {
    const router = useRouter();
    const { data } = useSession();
    const pathname = usePathname();
    const studentId = pathname.split('/')[3];
    const standardId = pathname.split('/')[4];
    const { control, handleSubmit } = useForm<FormData>();
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const onSubmit = async (formData: FormData) => {
        if (!data) {
            return;
        }

        try {
            setButtonLoading(true);
            const response = await assignMarksToStudentAnswerAPI({
                studentId,
                accessToken: data?.user?.accessToken || '',
                targetType: test.resource?.video
                    ? 'videoQuestion'
                    : 'assessmentResource',
                idsAndMarks: formData,
                standardId,
            });
            if (response.status !== 200) {
                toast.error(
                    response?.data?.message ||
                        'An Error occured while assigning marks'
                );
            }
            await action('getStudentProfileStandardResults');
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

    const handleViewAnswer = () => {
        const assesmentResourceId =
            test.resource?.AssessmentResourcesDetail?.id;
        if (assesmentResourceId) {
            return router.push(`${pathname}/${assesmentResourceId}`);
        }
        return toast.error('No answer URL available.');
    };

    return (
        <section className="w-full bg-white h-screen py-4 shadow-lg items-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="h-[90%] overflow-y-auto w-full px-6"
            >
                <div className="flex justify-between items-center">
                    <div className="flex my-7">
                        <div className="flex flex-col ml-2">
                            <h3 className="text-xl font-semibold mr-1">
                                {test.resource.name}
                            </h3>
                            <p className="text-sm text-dark-gray mb-2">
                                Student&apos;s Answer Report
                            </p>
                        </div>
                    </div>
                    <div className="rounded-full bg-white border p-1 cursor-pointer">
                        <X size={15} onClick={onClose} />
                    </div>
                </div>

                <div className="flex w-full">
                    <div className="p-4 border-2 border-green-600 bg-green-100 rounded-lg w-full">
                        <h1 className="font-medium">Obtained Weightage</h1>
                        <h1 className="mt-2 text-gray-600 font-semibold">
                            <span className="font-bold text-lg text-black">
                                {test.performance}
                            </span>
                        </h1>
                    </div>
                    <div className="p-4 border-2 rounded-lg w-full ml-4">
                        <h1 className="font-medium">Total Weightage</h1>
                        <h1 className="mt-2 text-gray-600 font-semibold">
                            <span className="font-bold text-lg text-black">
                                {test.weightage}
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="flex mt-2 w-full">
                    <div className="p-4 border-2 rounded-lg w-full">
                        <h1 className="font-medium">
                            Weightage Awaiting Evaluation
                        </h1>
                        <h1 className="mt-2 text-gray-600 font-semibold">
                            <span className="font-bold text-lg text-black">
                                {test.yetToMarkWeightage}
                            </span>
                        </h1>
                    </div>
                    <div className="p-4 border-2 border-red-600 bg-red-100 rounded-lg w-full ml-4">
                        <h1 className="font-medium">Unattempted Weightage</h1>
                        <h1 className="mt-2 text-gray-600 font-semibold ">
                            <span className="font-bold text-lg text-black">
                                {test.unAnsweredWeightage}
                            </span>
                        </h1>
                    </div>
                </div>

                <hr className="my-5" />

                {test.resource?.video &&
                    test.resource.video.questions?.map((question) => (
                        <div key={question.id}>
                            <h1 className="font-bold">{question.statement}</h1>
                            {(!question.options ||
                                Object.keys(question.options).length === 0) && (
                                <div>
                                    <p className="p-4 mt-2 border rounded-lg bg-gray-50">
                                        {question.answers[0]?.answer ||
                                            'No answer provided'}
                                    </p>
                                    <p className="mt-2 text-dark-gray font-semibold text-base border p-2 rounded-lg">
                                        Total Marks:{' '}
                                        <span className="text-primary-color">
                                            {question?.totalMarks || 0}
                                        </span>
                                    </p>
                                    {question.answers[0] && (
                                        <Controller
                                            name={question.id}
                                            control={control}
                                            defaultValue={
                                                question.answers[0]
                                                    ?.obtainedMarks >= 0
                                                    ? question.answers[0]
                                                          ?.obtainedMarks
                                                    : undefined
                                            }
                                            rules={{
                                                required:
                                                    'This field is required',
                                                validate: (value) =>
                                                    value >= 0 ||
                                                    'Value must be greater than or equal to 0',
                                            }}
                                            render={({ field, fieldState }) => (
                                                <div>
                                                    <input
                                                        type="number"
                                                        {...field}
                                                        className="mt-2 border p-2 rounded-lg w-full"
                                                        placeholder="Assign Marks"
                                                    />
                                                    {fieldState.error && (
                                                        <p className="text-red-500 text-xs mt-2">
                                                            {
                                                                fieldState.error
                                                                    .message
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    )}
                                </div>
                            )}
                            {question.options &&
                                Object.keys(question.options).length > 0 &&
                                Object.entries(question.options).map(
                                    ([key, option]) => (
                                        <p
                                            key={key}
                                            className={`p-3 my-2 border rounded-lg font-medium ${
                                                question?.answers[0] &&
                                                question.correctOption === key
                                                    ? 'flex justify-between border-green-600 text-green-600 items-center'
                                                    : 'text-gray-500'
                                            } ${
                                                question?.answers[0] &&
                                                question?.answers[0]?.answer ===
                                                    key &&
                                                question.correctOption !== key
                                                    ? 'flex justify-between border-red-600 text-red-600 items-center'
                                                    : 'text-gray-500'
                                            }`}
                                        >
                                            {option}
                                            {question?.answers[0] &&
                                                question.correctOption ===
                                                    key && (
                                                    <Check color="green" />
                                                )}
                                            {question?.answers[0] &&
                                                question?.answers[0]?.answer ===
                                                    key &&
                                                question.correctOption !==
                                                    key && <X color="red" />}
                                        </p>
                                    )
                                )}

                            <hr className="my-5" />
                        </div>
                    ))}
                {test.resource?.AssessmentResourcesDetail ? (
                    <div>
                        {test.resource?.AssessmentResourcesDetail
                            ?.assessmentAnswers[0] ? (
                            <>
                                <Button
                                    className="mb-2"
                                    type="button"
                                    onClick={handleViewAnswer}
                                >
                                    View Answer
                                </Button>
                                {test.resource?.AssessmentResourcesDetail
                                    ?.assessmentAnswers[0]?.answerURL && (
                                    <iframe
                                        title={test.resource?.name}
                                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                                            test.resource
                                                ?.AssessmentResourcesDetail
                                                ?.assessmentAnswers[0]
                                                ?.answerURL as string
                                        )}`}
                                        width="100%"
                                        height="280"
                                        loading="lazy"
                                    />
                                )}
                            </>
                        ) : (
                            <p className="p-4 mt-2 border rounded-lg bg-gray-50">
                                No answer provided
                            </p>
                        )}
                        {test.resource?.AssessmentResourcesDetail && (
                            <p className="mt-2 text-dark-gray font-semibold text-base border p-2 rounded-lg">
                                Total Marks:{' '}
                                <span className="text-primary-color">
                                    {test.resource?.AssessmentResourcesDetail
                                        ?.totalMarks || 0}
                                </span>
                            </p>
                        )}
                        {test.resource?.AssessmentResourcesDetail
                            ?.assessmentAnswers[0] && (
                            <div className="mt-2">
                                <Controller
                                    name={`${test.resource?.AssessmentResourcesDetail.id}`}
                                    control={control}
                                    defaultValue={
                                        test.resource?.AssessmentResourcesDetail
                                            ?.assessmentAnswers[0]
                                            ?.obtainedMarks >= 0
                                            ? test.resource
                                                  ?.AssessmentResourcesDetail
                                                  ?.assessmentAnswers[0]
                                                  ?.obtainedMarks
                                            : undefined
                                    }
                                    rules={{
                                        required: 'This field is required',
                                        validate: (value) =>
                                            value >= 0 ||
                                            'Value must be greater than or equal to 0',
                                    }}
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label className="text-md mb-1">
                                                Marks Obtained
                                            </Label>
                                            <input
                                                type="number"
                                                {...field}
                                                className="border p-2 rounded-lg w-full"
                                                placeholder="Assign Marks"
                                            />
                                            {fieldState.error && (
                                                <p className="text-red-500 text-xs mt-2">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                    </div>
                ) : null}
                <ModalFooter text="Save" loading={buttonLoading} />
            </form>
        </section>
    );
}

export default TestReportModal;
