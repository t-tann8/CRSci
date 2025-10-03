'use client';

import { ArrowLeft, CalendarDays } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import LearningTable, { LearningInterface } from '../LearningTable';
import OpenEndedQuestion from './OpenEndedQuestion';
import OpenEndedResult from './OpenEndedResult';
import Quiz from './Quiz';
import QuizResult from './QuizResult';
import Video from './Video';

export const LearningRecord: LearningInterface[] = [
    {
        id: 1,
        name: '3D Printing ',
        duration: '5:00',
        questions: '4',
        status: 'Play',
        isDone: true,
        isDisabled: false,
        resourceType: 'video',
        route: '#',
    },
    {
        id: 1,
        name: '3D Printing ',
        duration: '5:00',
        questions: '4',
        status: 'Continue',
        isDone: true,
        isDisabled: false,
        resourceType: 'video',
        route: '#',
    },
    {
        id: 1,
        name: '3D Printing ',
        duration: '5:00',
        questions: '4',
        status: 'Play',
        isDone: false,
        isDisabled: false,
        resourceType: 'video',
        route: '#',
    },
    {
        id: 1,
        name: '3D Printing ',
        duration: '5:00',
        questions: '4',
        status: 'Continue',
        isDone: false,
        isDisabled: false,
        resourceType: 'quiz',
        route: '#',
    },
];

function PlayCourse({ params }: any) {
    const { back, push } = useRouter();
    return (
        <section>
            <div className="flex flex-col justify-between items-center lg:flex-row space-y-2  mt-8">
                <div className="flex lg:space-x-2 items-center w-full justify-start mb-4 lg:mb-0 ">
                    <ArrowLeft onClick={back} />
                    <h1 className="text-black ml-2 font-semibold text-lg">
                        Artificial Intelligence - AI
                    </h1>
                </div>
                <div
                    className="bg-primary-color text-white w-full text-center lg:w-fit px-4 py-3 rounded-xl cursor-pointer"
                    onClick={() => push('/student/resources')}
                >
                    Resources
                </div>
            </div>

            {params.resourceType === 'video' && <Video />}

            {params.resourceType === 'openEndedQuiz' && (
                <>
                    <OpenEndedQuestion
                        questionNumber="2"
                        questionText="What are the three most important characteristics of this function? How would you stack rank yoursel"
                    />
                    {/* <OpenEndedResult isCorrect={false} />
                    <OpenEndedResult isCorrect /> */}
                </>
            )}

            {params.resourceType === 'quiz' && (
                <>
                    <Quiz
                        questionNumber="2"
                        questionText="If you could visit one planet, which would it be?"
                        options={[
                            { id: 1, value: 'Option 01' },
                            { id: 2, value: 'Option 02' },
                            { id: 3, value: 'Option 03' },
                            { id: 4, value: 'Option 04' },
                        ]}
                    />
                    {/* <QuizResult correctAnswer="Option 02" /> */}
                </>
            )}

            <div className="border rounded-lg p-5 mt-5">
                <div className="flex space-x-2 items-center mb-2">
                    <CalendarDays color="orange" size={20} />
                    <p className="font-semibold text-lg">Day 1</p>
                </div>
                <LearningTable learnings={LearningRecord} isSubmitAssignment />
            </div>
        </section>
    );
}

export default PlayCourse;
