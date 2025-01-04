import { Button } from "@nextui-org/react";

export const CommentsIcon = ({ fill = "currentColor", filled, size, height, width, ...props }) => {
    return (
        <svg
            fill={filled ? fill : "none"}
            height={size || height || 24}
            width={size || width || 24}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M12 2C6.48 2 2 5.9 2 10.5c0 2.87 1.8 5.38 4.49 6.86-.07.58-.39 2.01-1.21 3.14-.2.27-.3.61-.3.96 0 .75.76 1.27 1.47.94 2.19-1.04 3.6-2.08 4.48-2.67.89.18 1.81.27 2.77.27 5.52 0 10-3.9 10-8.5S17.52 2 12 2z"
                stroke={fill}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
        </svg>
    );
};
