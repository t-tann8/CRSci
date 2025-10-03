import React from "react";

function CheckPointIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <g stroke="#7AA43E" strokeLinecap="round" clipPath="url(#clip0_36_980)">
        <path
          strokeLinejoin="round"
          d="M5.667 8.333L7 9.667l3.333-3.334"
        ></path>
        <path d="M4.667 2.225a6.667 6.667 0 11-2.441 2.441"></path>
      </g>
      <defs>
        <clipPath id="clip0_36_980">
          <path fill="#fff" d="M0 0H16V16H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default CheckPointIcon;
