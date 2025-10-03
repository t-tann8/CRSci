import React from 'react';

function ResourceIcon({ ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            fill="none"
            viewBox="0 0 24 25"
            {...props}
        >
            <path
                stroke={props.color || '#F59A3B'}
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M22 12.853c0 2.707-1.927 4.97-4.5 5.52M6.286 18.5C3.919 18.5 2 16.604 2 14.265c0-2.34 1.919-4.236 4.286-4.236.284 0 .562.028.83.08m7.265-2.582a5.765 5.765 0 011.905-.321c.654 0 1.283.109 1.87.309m-11.04 2.594a5.577 5.577 0 01-.354-1.962c0-3.119 2.558-5.647 5.714-5.647 2.94 0 5.361 2.194 5.68 5.015m-11.04 2.594a4.29 4.29 0 011.55.634m9.49-3.228A5.724 5.724 0 0120 8.561"
            ></path>
            <path
                stroke={props.color || '#F59A3B'}
                strokeWidth="1.5"
                d="M8.5 17.5c0-1.414 0-2.121.44-2.56.439-.44 1.146-.44 2.56-.44h1c1.414 0 2.121 0 2.56.44.44.439.44 1.146.44 2.56v2c0 1.414 0 2.121-.44 2.56-.439.44-1.146.44-2.56.44h-1c-1.414 0-2.121 0-2.56-.44-.44-.439-.44-1.146-.44-2.56v-2z"
            ></path>
            <path
                stroke={props.color || '#F59A3B'}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M11 18.5h2"
            ></path>
        </svg>
    );
}

export default ResourceIcon;
