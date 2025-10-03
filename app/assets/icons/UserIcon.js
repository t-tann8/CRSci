import React from "react";

function UserIcon({ ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="none"
            viewBox="0 0 40 40"
            {...props}
        >
            <circle
                cx="19.566"
                cy="19.566"
                r="19.566"
                fill="white"
                fillOpacity="0.1"
            ></circle>
            <circle cx="20" cy="14" r="4" stroke="#A03ADB" strokeWidth="1.5"></circle>
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M26 17c1.657 0 3-1.12 3-2.5S27.657 12 26 12M14 17c-1.657 0-3-1.12-3-2.5s1.343-2.5 3-2.5"
                opacity="0.5"
            ></path>
            <ellipse
                cx="20"
                cy="25"
                stroke="#A03ADB"
                strokeWidth="1.5"
                rx="6"
                ry="4"
            ></ellipse>
            <path
                stroke="#A03ADB"
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M28 27c1.754-.385 3-1.359 3-2.5s-1.246-2.115-3-2.5M12 27c-1.754-.385-3-1.359-3-2.5s1.246-2.115 3-2.5"
                opacity="0.5"
            ></path>
        </svg>
    );
}

export default UserIcon;