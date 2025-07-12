import { ReactElement } from "react"

interface ButtonProps {
    variant: "primary" | "secondary";
    text: string;
    startIcon?: ReactElement;
    onClick?: () => void;
    loading?: boolean;
}

const variantClasses = {
    "primary": "bg-slate-900 text-white border",
    "secondary": "bg-slate-200 text-slate-900 border"
}

const defaultStyles = "px-4 py-2 gap-2 rounded-md font-light flex items-center"

export function Button({ variant, text, startIcon, onClick, loading }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`${variantClasses[variant]} ${defaultStyles} ${loading ? "bg-gray-300 " : "bg-slate-100"
                }`}
            disabled={loading}
        >
            {startIcon && <div className="pr-1">{startIcon}</div>}
            <span>{loading ? "Loading..." : text}</span>
        </button>
    );
}      