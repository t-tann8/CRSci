import React from 'react';
import PlayCourseImage from '@/app/assets/images/playCourseImage.svg';
import { BookmarkMinus } from 'lucide-react';
import Image from 'next/image';

function Video() {
    return (
        <div className="flex items-center mt-5 relative">
            <Image
                src={PlayCourseImage as string}
                alt="play"
                className="w-full object-cover h-64 md:h-full"
            />
            <div className="absolute top-1 right-1 lg:top-5 lg:right-5 z-10 border flex space-x-2 items-center rounded-xl p-2">
                <BookmarkMinus size={25} color="white" />
                <p className="text-white">Save Here</p>
            </div>
        </div>
    );
}

export default Video;
