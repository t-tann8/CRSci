import Image from 'next/image';
import React from 'react';
import Character from '@/app/assets/images/character.svg';
import { X } from 'lucide-react';

interface Option {
    id: number;
    value: string;
}
interface QuizProp {
    questionNumber: string;
    questionText: string;
    options: Option[];
}

function Quiz({ questionNumber, questionText, options }: QuizProp) {
    return (
        <div className="bg-lighter-gray px-5 py-10 lg:p-10  rounded-lg my-4  flex flex-col justify-center items-center">
            <div className="text-center">
                <h1 className="font-semibold text-xl mb-2">
                    Question {questionNumber}
                    <span className="text-green-500 font-bold text-2xl">
                        &nbsp;?
                    </span>
                </h1>
                <p className="text-dark-gray font-medium mb-4 text-center ">
                    Answer Below Question to Move Forward!
                </p>
            </div>

            <div className=" lg:mt-5 lg:w-[40%] flex flex-col items-center  ">
                <div className=" m-auto">
                    <p className="font-semibold mb-4">{questionText}</p>
                    <label
                        htmlFor="answer"
                        className="text-start w-full font-medium"
                    >
                        Select One:
                    </label>
                    {options.map((option, index) => (
                        <div
                            className={`w-full px-4 py-3 rounded-xl mb-4 mt-2 bg-white border flex justify-between items-center ${
                                index === 0 && 'border-2 border-red-500'
                            }`}
                            key={option.id}
                        >
                            <span>{option.value}</span>
                            {index === 0 && (
                                <span className="text-red-500 font-bold text-xl">
                                    <X />
                                </span>
                            )}
                        </div>
                    ))}

                    <div className=" w-full flex lg:justify-end">
                        <button
                            type="button"
                            className="lg:mr-4 bg-primary-color text-white my-2 px-10 py-2 w-full lg:w-fit rounded-xl"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-2  w-full">
                <button
                    type="button"
                    className="border text-dark-gray w-full lg:w-fit  px-10 py-1 rounded-xl text-sm"
                >
                    I&apos;ll Do it Later
                </button>
            </div>
        </div>
    );
}

export default Quiz;
