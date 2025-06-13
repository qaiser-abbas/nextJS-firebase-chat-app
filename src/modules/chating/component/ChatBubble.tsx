import React, { useEffect, useRef, useState } from "react";

interface ChatBubbleProps {
    id: string;
    isSender: boolean;
    message: string;
    image?: string;
    onEdit: (id: string, oldText: string) => void;
    onDelete: (id: string) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
    id,
    isSender,
    message,
    image,
    onEdit,
    onDelete,
}) => {
    return (
        <div
            className={`relative flex ${isSender
                    ? "justify-end items-center gap-5"
                    : "justify-start items-center gap-5"
                } mb-2`}
        >
            {isSender && (
                <div className=" z-10">
                    <ul className="text-sm text-gray-700 flex gap-2 items-center">
                        <li onClick={() => onEdit(id, message)} className=" cursor-pointer">
                            <img src="/edit.svg" alt="" className="w-6" />
                        </li>
                        <li onClick={() => onDelete(id)} className=" cursor-pointer">
                            <img src="/delete3.svg" alt="" className=" " />
                        </li>
                    </ul>
                </div>
            )}
            <div
                className={`relative p-3 rounded-xl max-w-[70%] shadow-lg ${isSender
                        ? "bg-[#5D2294] text-white"
                        : "bg-[#8B8F94] text-black shadow-lg"
                    }`}
            >
                {message && <p>{message}</p>}

                {image && (
                    <img src={image} alt="media" className="mt-2 rounded-lg max-h-48" />
                )}
            </div>
        </div>
    );
};

export default ChatBubble;
