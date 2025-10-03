import React from 'react';
import Character from '@/app/assets/images/character.svg';
import AngryCharacter from '@/app/assets/images/angryCharacter.svg';
import Image from 'next/image';
import { AlertOctagon, Check } from 'lucide-react';

interface OpenEndedQuestionProp {
    isCorrect: boolean;
}
function OpenEndedResult({ isCorrect }: OpenEndedQuestionProp) {
    return (
        <section className="bg-lighter-gray px-5 py-10 lg:p-10  rounded-lg my-4 flex flex-col justify-between items-center">
            <p className="flex space-x-2 font-semibold text-xl">
                {isCorrect ? (
                    <>
                        <span>Correct Answer</span> <Check color="green" />
                    </>
                ) : (
                    <>
                        <span>Incorrect Answer</span>
                        <AlertOctagon color="red" />
                    </>
                )}
            </p>
            <p className="text-dark-gray font-medium text-sm text-center lg:text-left lg:mb-0">
                {isCorrect
                    ? 'The Answer Is Correct Continue Watching'
                    : 'The Answer Is InCorrect Try Again'}
            </p>

            <div className=" m-auto lg:m-0 lg:px-20 py-5 lg:py-5">
                {isCorrect ? (
                    <Image src={Character as string} alt="character" />
                ) : (
                    <Image src={AngryCharacter as string} alt="character" />
                )}
            </div>
            <div className="lg:w-[50%] text-center">
                <p className={`font-semibold ${!isCorrect && 'text-red-500'}`}>
                    “Sed ut perspiciatis unde omnis iste natus error sit vo
                    luptatem accus antium doloremque laudantium, to”
                </p>
                <div className=" w-full flex lg:justify-end">
                    <button
                        type="button"
                        className=" mt-5 lg:mt-3 bg-primary-color text-white my-2 px-8 py-2 w-full lg:w-fit rounded-xl"
                    >
                        {isCorrect ? 'Continue' : 'Try Again'}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default OpenEndedResult;
