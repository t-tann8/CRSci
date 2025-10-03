import { EditIcon, LucideIcon, PlayIcon } from 'lucide-react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface IconProps {
    FirstIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
    SecondIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
    ThirdIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
}

interface CardContentProps {
    id: string | undefined;
    route?: string;
    heading: string;
    first: string;
    second: string;
    third: string;
    Icons: IconProps;
    imageUrl: string | StaticImport;
}

function VideoCard({
    id,
    route,
    heading,
    first,
    second,
    third,
    Icons,
    imageUrl,
}: CardContentProps) {
    const { FirstIcon, SecondIcon, ThirdIcon } = Icons;
    return (
        <div>
            <Link href="#" className="relative">
                <Image src={imageUrl} alt="video" className="w-full" />
                <div className="absolute left-1/2 bottom-[29%] transform -translate-x-1/2 -translate-y-1/2">
                    <PlayIcon fill="white" color="white" size={35} />
                </div>
            </Link>
            <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 mt-5">
                {heading}
            </h5>
            <div>
                <div className="flex gap-2 mb-2">
                    <div className="flex gap-1 items-center text-dark-gray text-sm">
                        <FirstIcon height={17} width={17} color="#F59A3B" />
                        <p>{first}</p>
                    </div>
                    <div className="flex gap-1 items-center text-dark-gray text-sm">
                        <SecondIcon width={17} height={17} color="#7AA43E" />
                        <p>{second}</p>
                    </div>
                </div>
                <div className="flex gap-1 items-center mb-5 text-dark-gray text-sm">
                    <ThirdIcon height={17} width={17} color="#54C3F4" />
                    <p>{third}</p>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
