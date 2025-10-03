'use client';

import React, { useEffect, useState } from 'react';
import WavingHandIcon from '@/app/assets/icons/WavingHand';
import SlideDots from '@/app/assets/icons/SlideDots';

interface MetaText {
    title: string;
    description: string;
}

interface LeftSideProp {
    images: any[];
    metaText: MetaText;
}

function LeftSide({ images, metaText }: LeftSideProp) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    const goToSlide = (slideIndex: any) => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex(slideIndex);
            setIsFading(false);
        }, 500);
    };

    useEffect(() => {
        const nextSlide = () => {
            const isLastSlide = currentIndex === images.length - 1;
            const newIndex = isLastSlide ? 0 : currentIndex + 1;
            goToSlide(newIndex);
        };

        const intervalId = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [currentIndex, images.length]);

    return (
        <div className="bg-light-gray lg:p-10 flex flex-col justify-center items-center h-full">
            <div className="max-w-[1400px] h-[480px] lg:h-[480px] w-full relative group">
                <div
                    style={{
                        backgroundImage: `url(${images[currentIndex].src})`,
                    }}
                    className={`w-full h-full rounded-2xl bg-center bg-contain lg:bg-auto bg-no-repeat duration-500 ${
                        isFading ? 'opacity-0' : 'opacity-100'
                    } transition-opacity`}
                />
            </div>
            <div className="flex justify-center items-center flex-col ">
                <h1 className="flex space-x-3 ">
                    <span className="font-semibold text-xl">
                        {metaText.title}
                    </span>
                    <WavingHandIcon />
                </h1>
                <p className="font-medium text-dark-gray w-[80%] text-center">
                    {metaText.description}
                </p>
            </div>
            <div className="flex top-4 justify-center py-2 mt-5 ">
                {images.map((image, slideIndex) => (
                    <div
                        key={image}
                        onClick={() => goToSlide(slideIndex)}
                        className="cursor-pointer ml-2"
                    >
                        <SlideDots
                            size={30}
                            fill={
                                currentIndex === slideIndex
                                    ? '#F59A3B'
                                    : '#E7EAE9'
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LeftSide;
