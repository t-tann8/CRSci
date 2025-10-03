import React from 'react';

function ButtonLoader({ style }: { style?: string }) {
    return (
        <div className="flex space-x-2 justify-center items-center">
            <div
                className={`h-5 w-5 ${
                    style ? `bg-${style}` : 'bg-white'
                } rounded-full animate-bounce`}
                style={{ animationDelay: '-0.3s' }}
            />
            <div
                className={`h-5 w-5 ${
                    style ? `bg-${style}` : 'bg-white'
                } rounded-full animate-bounce`}
                style={{ animationDelay: '-0.15s' }}
            />
            <div
                className={`h-5 w-5 ${
                    style ? `bg-${style}` : 'bg-white'
                } rounded-full animate-bounce`}
            />
        </div>
    );
}

export default ButtonLoader;
