'use client';

import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import crsLoader from '@/app/assets/images/crsLoader.json';

function PageLoader({
    additionalClasses = '',
}: {
    additionalClasses?: string;
}) {
    if (!crsLoader) {
        return <div>Loading...</div>;
    }
    return (
        <div className={`${additionalClasses} mt-44`}>
            <Player
                style={{ height: '30vh', width: '100%' }}
                src={crsLoader}
                autoplay
                loop
                speed={1}
            />
        </div>
    );
}

export default PageLoader;
