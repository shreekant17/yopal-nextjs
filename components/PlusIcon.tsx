import { Button } from "@nextui-org/react";

export const PlusIcon = ({ fill = "currentColor", size, height, width, ...props }) => {
    return (
        <svg
            fill={fill}
            height={size || height || 24}
            viewBox="0 0 24 24"
            width={size || width || 24}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M12 5v14M5 12h14"
                stroke={fill}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
        </svg>
    );
};
