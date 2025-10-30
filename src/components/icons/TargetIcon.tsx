import React from 'react';

export const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9 9 0 100-18 9 9 0 000 18z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 14a3 3 0 100-6 3 3 0 000 6z"
    />
     <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 12.5a.5.5 0 100-1 .5.5 0 000 1z"
    />
  </svg>
);
