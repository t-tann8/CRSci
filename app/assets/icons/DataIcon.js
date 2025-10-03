import React from "react";

function DataIcon({ ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="39"
            height="40"
            fill="none"
            viewBox="0 0 39 40"
            {...props}
        >
            <ellipse
                cx="19.523"
                cy="19.566"
                // fill="#F59A3B"
                // fillOpacity="0.1"
                rx="18.783"
                ry="19.566"
            ></ellipse>
            <path
                stroke="#F59A3B"
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M29.167 18.625V20c0 4.321 0 6.482-1.343 7.824-1.342 1.343-3.503 1.343-7.824 1.343s-6.482 0-7.824-1.343c-1.343-1.342-1.343-3.503-1.343-7.824s0-6.482 1.343-7.824c1.342-1.343 3.503-1.343 7.824-1.343h1.375"
            ></path>
            <path
                stroke="#F59A3B"
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M15.417 21.833l1.647-1.976c.652-.784.979-1.175 1.408-1.175.43 0 .756.392 1.409 1.175l.238.286c.653.784.98 1.175 1.409 1.175.43 0 .755-.392 1.408-1.175l1.647-1.976"
            ></path>
            <ellipse
                cx="26.417"
                cy="13.583"
                stroke="#F59A3B"
                strokeWidth="1.5"
                rx="2.75"
                ry="2.75"
            ></ellipse>
        </svg>
    );
}

export default DataIcon;