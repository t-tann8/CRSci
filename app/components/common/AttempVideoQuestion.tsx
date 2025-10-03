import {
    useForm,
    SubmitHandler,
    FieldValues,
    FormProvider,
} from 'react-hook-form';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import action from '@/app/action';
import { validationError } from '@/lib/utils';
import CharacterImage from '@/app/assets/images/character.svg';
import { createVideoQuestionAnswerAPI } from '@/app/api/student';
import QuestionMarkIcon from '@/app/assets/icons/QuestionMarkIcon';
import FormError from './FormError';
import PageLoader from './PageLoader';

export default function AttempVideoQuestion({
    hideButton,
    question,
    continueVideo,
    markQuestionAsAnswered,
    standardId,
}: {
    hideButton?: boolean;
    question: {
        id: string;
        statement: string;
        options: { [key: string]: string };
        correctOption: string;
        correctOptionExplanation: string;
        totalMarks: number;
        attempt?: {
            id: string;
            answer: string;
            obtainedMarks: number;
        };
    };
    continueVideo: () => void;
    markQuestionAsAnswered: () => void;
    standardId: string;
}) {
    const { data } = useSession();
    const methods = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const [questionType, setQuestionType] = useState('');

    // Determine question type when question prop changes
    useEffect(() => {
        if (question && question.options) {
            if (Object.keys(question.options).length > 0) {
                setQuestionType('mcq');
            } else {
                setQuestionType('open');
            }
        }
    }, [question]);

    const handleUpload = async (formData: any) => {
        if (!data) {
            return;
        }
        try {
            const APIresponse = await createVideoQuestionAnswerAPI({
                accessToken: data?.user?.accessToken,
                userId: data?.user?.id,
                questionId: question.id,
                answer:
                    questionType === 'mcq'
                        ? formData.selectedOption
                        : formData.statement,
                standardId: standardId || '',
            });
            if (APIresponse.status !== 200) {
                throw new Error(
                    APIresponse?.data?.message ||
                        'An error occured while submitting your answer'
                );
            }
            markQuestionAsAnswered();
            toast.success('Answer submitted successfully');
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    'An error occured while submitting your answer'
            );
        }
        action('getStudentVideo');
        continueVideo();
    };

    return !data ? (
        <PageLoader />
    ) : (
        <div className="flex h-[480px] bg-light-gray rounded-lg items-center justify-center gap-24 relative">
            <div className="text-center mobile:hidden">
                <Image
                    src={CharacterImage}
                    width={150}
                    height={150}
                    alt="quiz"
                />
            </div>
            <div className="sm:basis-4/12">
                <div className="text-lg">
                    <FormProvider {...methods}>
                        <form
                            className="p-2"
                            onSubmit={methods.handleSubmit(
                                handleUpload as SubmitHandler<FieldValues>
                            )}
                        >
                            <div className="flex items-center justify-center flex-col mb-8">
                                <span className="flex items-center font-semibold text-2xl">
                                    Question
                                    <QuestionMarkIcon fill="#7AA43E" />
                                </span>
                                <span className="text-dark-gray text-sm font-medium">
                                    Answer Below Question to Move Forward!
                                </span>
                            </div>
                            <div className="flex flex-col items-baseline mb-3">
                                <span className="text-xl font-semibold">
                                    Question: {question?.statement}
                                </span>
                                <span className="mt-1 text-sm font-medium">
                                    Answer:
                                </span>
                            </div>
                            {questionType === 'open' && (
                                <>
                                    <textarea
                                        placeholder="Write Your Answer"
                                        className=" mt-1 block w-full h-[120px] px-3 py-3 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-medium"
                                        {...methods.register('statement', {
                                            required: {
                                                value: true,
                                                message:
                                                    validationError.REQUIRED_FIELD,
                                            },
                                        })}
                                    />
                                    <FormError name="statement" />
                                </>
                            )}
                            {questionType === 'mcq' && (
                                <>
                                    {Object.entries(question?.options).map(
                                        ([optionKey, optionValue]) => (
                                            <div
                                                key={optionKey}
                                                className="mt-3 bg-white px-4 py-1 rounded-xl"
                                            >
                                                <input
                                                    type="radio"
                                                    className="mr-2"
                                                    id={optionKey}
                                                    value={optionKey}
                                                    {...methods.register(
                                                        'selectedOption'
                                                    )}
                                                />
                                                <label htmlFor={optionKey}>
                                                    {optionValue}
                                                </label>
                                            </div>
                                        )
                                    )}
                                </>
                            )}
                            {data?.user?.role === 'student' && (
                                <button
                                    className="bg-primary-color text-sm text-white px-6 py-2 rounded-lg hover:bg-orange-400 float-right mt-2"
                                    type="submit"
                                >
                                    Next
                                </button>
                            )}
                            {data?.user?.role !== 'student' && hideButton && (
                                <button
                                    className="bg-primary-color text-sm text-white px-6 py-3 rounded-lg hover:bg-orange-400 float-right mt-4"
                                    type="button"
                                    onClick={continueVideo}
                                >
                                    Continue
                                </button>
                            )}
                        </form>
                    </FormProvider>
                </div>
            </div>
            {!hideButton && (
                <div
                    className="absolute bottom-0 right-0 mb-6 text-dark-gray mr-6 text-[10px] font-semibold border border-dark-gray px-4 py-2 rounded-lg hover:bg-dark-gray hover:text-light-gray cursor-pointer"
                    onClick={continueVideo}
                >
                    <button type="button">Skip</button>
                </div>
            )}
        </div>
    );
}
