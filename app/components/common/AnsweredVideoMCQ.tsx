import Image from 'next/image';
import React from 'react';
import CharacterImage from '@/app/assets/images/character.svg';
import QuestionMarkIcon from '@/app/assets/icons/QuestionMarkIcon';
import AngryCharacter from '@/app/assets/images/angryCharacter.svg';
import { AlertCircle, Check } from 'lucide-react';

export default function AnsweredVideoMCQ({
    question,
    continueVideo,
}: {
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
}) {
    return (
        <div className="flex h-[480px] bg-light-gray rounded-lg items-center justify-center gap-5 px-4">
            <div className="text-center mobile:hidden">
                {question.attempt?.obtainedMarks === question.totalMarks ? (
                    <Image
                        src={CharacterImage}
                        width={150}
                        height={150}
                        alt="quiz"
                    />
                ) : (
                    <Image
                        src={AngryCharacter}
                        width={150}
                        height={150}
                        alt="quiz"
                    />
                )}
            </div>
            <div className="sm:basis-2/5">
                <div className="text-lg">
                    {!question.attempt ? (
                        <div className="flex items-center justify-center flex-col mb-8">
                            <span className="flex items-center font-semibold">
                                Question
                                <QuestionMarkIcon fill="#7AA43E" />
                            </span>
                            <span className="text-dark-gray text-sm font-medium">
                                Answer Below Question to Move Forward!
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center flex-col mb-8">
                            <span className="flex items-center font-semibold text-2xl">
                                {question.attempt?.obtainedMarks ===
                                question.totalMarks
                                    ? 'Correct Answer'
                                    : 'Incorrect Answer'}
                                <div className="ml-2">
                                    {question.attempt?.obtainedMarks ===
                                    question.totalMarks ? (
                                        <Check color="green" />
                                    ) : (
                                        <AlertCircle color="red" />
                                    )}
                                </div>
                            </span>
                            <span className="text-dark-gray text-sm font-medium">
                                Below is The Correct Answer & Explanation
                            </span>
                        </div>
                    )}
                    <div className="flex flex-col items-baseline mb-3">
                        <span className=" text-xl font-semibold mb-1">
                            Question: {question?.statement}
                        </span>
                        <span className="text-sm my-2">Correct Answer:</span>
                        <span className="mt-1 text-sm border-2 w-full py-2 px-4 border-green-600 rounded-xl">
                            {question?.options[question?.correctOption]}
                        </span>
                        <span className="text-sm mt-2">Explanation:</span>
                        <span className="mt-2 border-2 text-sm border-gray-400 px-4 py-2 rounded-xl">
                            {question.correctOptionExplanation}
                        </span>
                    </div>
                    <button
                        className="bg-primary-color text-sm text-white px-6 py-2 rounded-lg hover:bg-orange-400 float-right mt-2"
                        type="button"
                        onClick={continueVideo}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
