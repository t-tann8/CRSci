import React from 'react';

function PlayIcon({ ...props }) {
    return (
        <svg
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M1 7.73938V12.384C1 13.924 2.68933 14.8967 4.06467 14.1494L6.2 12.988M1 5.07271V3.09471C1 1.55471 2.68933 0.582048 4.06467 1.32938L12.606 5.97471C12.9262 6.14499 13.194 6.39918 13.3808 6.71004C13.5676 7.0209 13.6663 7.37672 13.6663 7.73938C13.6663 8.10204 13.5676 8.45786 13.3808 8.76872C13.194 9.07959 12.9262 9.33377 12.606 9.50405L8.33533 11.8267"
                stroke="#85878D"
                strokeWidth="1.5"
                strokeLinecap="round"
                {...props}
            />
        </svg>
    );
}

export default PlayIcon;
