import React from "react";

function QueryIcon({ ...props }) {
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
                fill={props.color || "#131123"}
                d="M12 16.5a.75.75 0 01-.75-.75v-2h-2a.75.75 0 010-1.5h2v-2a.75.75 0 011.5 0v2h2a.75.75 0 110 1.5h-2v2a.75.75 0 01-.75.75z"
            ></path>
            <path
                fill={props.color || "#131123"}
                fillRule="evenodd"
                d="M19.414 6.414A2 2 0 0120 7.828V20a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8.172a2 2 0 011.414.586l3.828 3.828zM18.5 7.828V20a.5.5 0 01-.5.5H6a.5.5 0 01-.5-.5V4a.5.5 0 01.5-.5h8.172a.5.5 0 01.353.146l3.829 3.829a.5.5 0 01.146.353z"
                clipRule="evenodd"
            ></path>
        </svg>
    );
}

export default QueryIcon;