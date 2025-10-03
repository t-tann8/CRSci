import Image from 'next/image';
import React from 'react';
import Character from '@/app/assets/images/character.svg';
import { Label } from '@/app/components/ui/label';

interface OpenEndedQuestionProp {
    questionNumber: string;
    questionText: string;
}

function OpenEndedQuestion({
    questionNumber,
    questionText,
}: OpenEndedQuestionProp) {
    return (
        <div className="bg-lighter-gray  py-10 px-5 lg:p-10  rounded-lg my-4 ">
            <div className="flex flex-col justify-center items-center">
                <h1 className="font-semibold text-xl mb-2">
                    Question {questionNumber}
                    <span className="text-green-500 font-bold text-2xl">
                        &nbsp;?
                    </span>
                </h1>
                <p className="text-dark-gray font-medium mb-4 text-center lg:text-left">
                    Answer Below Question to Move Forward!
                </p>
            </div>

            <div className="flex flex-col lg:flex-row mt-7 lg:mt-14 ">
                <div className=" m-auto lg:m-0 lg:px-20 ">
                    <Image src={Character as string} alt="character" />
                </div>
                <div className="flex flex-col w-full lg:w-[50%]  space-y-2 mt-5 ">
                    <p className="font-semibold mb-2">{questionText}</p>
                    <Label
                        htmlFor="answer"
                        className="text-start w-full font-medium"
                    >
                        Answer:
                    </Label>
                    <textarea
                        id="answer"
                        name="answer"
                        placeholder="Write your answer"
                        className="w-full h-32 overflow-y-auto resize-none p-4 font-medium rounded-lg border focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
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
            <div className="flex justify-end mt-2">
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

export default OpenEndedQuestion;
