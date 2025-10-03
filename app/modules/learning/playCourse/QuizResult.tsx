import Image from 'next/image';
import React from 'react';
import Character from '@/app/assets/images/character.svg';
import { AlertOctagon, Check } from 'lucide-react';

interface QuizResultProp {
    correctAnswer: string;
}

function QuizResult({ correctAnswer }: QuizResultProp) {
    return (
        <div className="bg-lighter-gray  px-7 py-10 lg:p-10 lg:py-20 rounded-lg my-4  flex flex-col justify-center items-center">
            <div>
                <h1 className="font-semibold text-xl mb-2 flex items-center space-x-2 justify-center">
                    <span>Incorrect Answer</span>
                    <AlertOctagon color="red" />
                </h1>
                <p className="text-dark-gray font-medium mb-4 text-center ">
                    Here’s The Correct Answer & Explanation
                </p>
            </div>

            <div className=" lg:mt-5 lg:w-[40%] flex flex-col items-center  ">
                <div className=" m-auto">
                    <p className="font-semibold my-5 lg:mt-0 lg:mb-4  ">
                        “Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem
                    </p>
                    <label htmlFor="answer" className="w-full font-medium ">
                        Correct Answer
                    </label>

                    <div className="w-full px-4 py-3 rounded-xl mb-4 mt-1 border-2 border-green-600 flex justify-between items-center">
                        <span>{correctAnswer}</span>
                        <span className="text-green-600 font-bold text-xl">
                            <Check />
                        </span>
                    </div>

                    <div className=" w-full flex lg:justify-end">
                        <button
                            type="button"
                            className="lg:mr-4 bg-primary-color lg:hover:bg-orange-400 text-white my-2 px-10 py-2 w-full lg:w-fit rounded-xl"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizResult;
