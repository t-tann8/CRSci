import React from "react";

function QuestionIcon({ ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            {...props}
        >
            <g clipPath="url(#clip0_36_979)">
                <path
                    stroke="#F59A3B"
                    strokeLinecap="round"
                    d="M6.75 5.917a1.25 1.25 0 111.886 1.076c-.317.188-.636.472-.636.84v.834"
                ></path>
                <ellipse
                    cx="8"
                    cy="10.667"
                    fill="#F59A3B"
                    rx="0.667"
                    ry="0.667"
                ></ellipse>
                <path
                    stroke="#F59A3B"
                    strokeLinecap="round"
                    d="M4.667 2.225a6.667 6.667 0 11-2.441 2.441"
                ></path>
            </g>
            <defs>
                <clipPath id="clip0_36_979">
                    <path fill="#fff" d="M0 0H16V16H0z"></path>
                </clipPath>
            </defs>
        </svg>
    );
}

export default QuestionIcon;