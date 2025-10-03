import React from 'react';

function PictureIcon({ ...props }) {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M10.25 5H10.2575M8.375 14.75H3.5C2.90326 14.75 2.33097 14.5129 1.90901 14.091C1.48705 13.669 1.25 13.0967 1.25 12.5V3.5C1.25 2.90326 1.48705 2.33097 1.90901 1.90901C2.33097 1.48705 2.90326 1.25 3.5 1.25H12.5C13.0967 1.25 13.669 1.48705 14.091 1.90901C14.5129 2.33097 14.75 2.90326 14.75 3.5V8.375"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.25 11.0004L5 7.25036C5.696 6.58061 6.554 6.58061 7.25 7.25036L9.875 9.87536"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9.5 9.50041L10.25 8.75041C10.7593 8.26066 11.3548 8.12866 11.9105 8.35591M13.25 15.5004V11.0004M13.25 11.0004L15.5 13.2504M13.25 11.0004L11 13.2504"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default PictureIcon;
