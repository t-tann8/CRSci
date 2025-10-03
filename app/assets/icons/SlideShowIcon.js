import React from "react";

function SlideShowIcon({ ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                stroke={props.color || "#F59A3B"}
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M3 12v6.967c0 2.31 2.534 3.769 4.597 2.648l3.203-1.742M3 8V5.033c0-2.31 2.534-3.769 4.597-2.648l12.812 6.968a2.998 2.998 0 010 5.294l-6.406 3.484"
            ></path>
        </svg>
    );
}

export default SlideShowIcon;
