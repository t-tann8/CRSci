import React from 'react';

function Bars({ ...props }) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M13.333 4.66663L7.33301 4.66663"
                stroke="#131123"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M2.66699 11.3334L8.66699 11.3334"
                stroke="#131123"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M2.66699 8H4.66699L13.3337 8"
                stroke="#131123"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default Bars;
