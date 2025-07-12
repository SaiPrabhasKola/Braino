import { ReactElement } from "react";

export function SidebarItem({ text, icon, onClick }: {
    text: string;
    icon: ReactElement;
    onClick?: () => void; // Add an optional onClick prop
}) {
    return (
        <div
            className="flex cursor-pointer hover:bg-gray-300 rounded transition-all duration-300"
            onClick={onClick}
        >
            <div className="p-2 text-gray-700">
                {icon}
            </div>
            <div className="p-2 text-gray-700">
                {text}
            </div>
        </div>
    );
}
