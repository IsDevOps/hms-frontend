import React from 'react';

const NigFlagIcon = ({ className }: { className?: string }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect width="24" height="24" fill="white" />
            <rect x="0" width="8" height="24" fill="#008751" />
            <rect x="16" width="8" height="24" fill="#008751" />
        </svg>
    );
};

export default NigFlagIcon;
