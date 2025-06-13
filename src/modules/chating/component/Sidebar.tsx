"use client";
import React, { useEffect, useState } from "react";
import { Api } from "@/src/services/service";
import usePresence from "@/src/hooks/usePresence";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/firebase/config";

interface User {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    isOnline?: boolean;
    lastChanged?: number; // Add this
    unreadCount?: number; // Add this to fix the error
}

interface ChatMeta {
    chatId: string;
    lastMessage: string;
    updatedAt?: { seconds: number };
    unread: boolean;
    unreadCount: number;
    otherUser: User;
}

interface SidebarProps {
    currentUserId: string;
    onSelectUser: (otherUser: User) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUserId, onSelectUser }) => {
    usePresence();
    const [users, setUsers] = useState<User[]>([]);

    const [chatUsers, setChatUsers] = useState<ChatMeta[]>([]);

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const fetchAndEnrichUsers = async () => {
            const rawUsers = await Api.auth.getAllUsers(currentUserId);
            const chats = await Api.Chat.getUserChats(currentUserId);

            const enriched = rawUsers.map((user) => {
                const chat = chats.find(
                    (c) => c.otherUser.id === user.id || user.id === c.otherUser.id
                );
                return {
                    ...user,
                    unreadCount: chat?.unreadCount || 0,
                    lastMessage: chat?.lastMessage || "",
                };
            });

            setAllUsers(enriched);
        };

        if (currentUserId) {
            fetchAndEnrichUsers();
            intervalId = setInterval(fetchAndEnrichUsers, 5000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [currentUserId]);

    // Filter whenever searchTerm or allUsers updates
    useEffect(() => {
        const filtered = allUsers.filter(
            (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setUsers(filtered);
    }, [searchTerm, allUsers]);

    return (
        <div className="w-1/4 border-r bg-[#F2F5F9] h-screen md:h-[570px] overflow-y-auto">
            <div className="p-4 font-bold text-lg border-b ">All Users</div>
            <div className="p-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white shadow-2xl"
                    placeholder="Search users..."
                />
            </div>

            <ul className="p-2 flex flex-col gap-2">
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="bg-white py-2 px-4 hover:bg-[#2F3442] group rounded-2xl hover:text-white shadow-2xl cursor-pointer flex items-center gap-2"
                        onClick={() => onSelectUser(user)}
                    >
                        {user.photoURL ? (
                            <img
                                src={user.photoURL || "/profile.jpg"}
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                    <div className="font-semibold">{user.name}</div>
                                    <div
                                        className={`text-sm ${user.isOnline ? "text-green-500" : "text-gray-500"
                                            }`}
                                    >
                                        {user.isOnline ? "online" : "offline"}
                                    </div>
                                </div>

                                {/* ✅ Notification badge only if unreadCount > 0 */}

                                <div className="relative">
                                    {(user.unreadCount ?? 0) > 0 && (
                                        <span className="absolute -top-3 -right-2 bg-[#5D2294] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {user.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div
                                className="flex justify-between items-center text-sm text-gray-600
                                group-hover:text-white  hover:bg-[#2F3442] 
                            "
                            >
                                <div className="truncate max-w-[140px]">
                                    {/* {user.email} */}
                                    {user.lastMessage || "No messages yet"}
                                </div>
                                {user.lastChanged && (
                                    <div className="ml-2 text-xs text-gray-400 flex justify-end">
                                        {new Date(user.lastChanged).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
