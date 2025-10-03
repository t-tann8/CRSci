import React from 'react';

function MovieIcon({ ...props }) {
    return (
        <svg
            width="17"
            height="22"
            viewBox="0 0 17 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M16.7832 21.2395H0.783203V0.239502H11.7832L16.7832 5.2395V21.2395Z"
                fill="#54C3F4"
            />
            <path
                d="M11.7832 12.7395L6.7832 9.7395V15.7395L11.7832 12.7395Z"
                fill="#1976D2"
            />
        </svg>
    );
}

export default MovieIcon;
