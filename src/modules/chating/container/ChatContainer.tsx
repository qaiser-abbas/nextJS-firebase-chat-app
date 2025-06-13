"use client";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../component/Sidebar";
import ChatBubble from "../component/ChatBubble";
import toast, { Toaster } from "react-hot-toast";

import { Api } from "@/src/services/service";
import { onMessage } from "firebase/messaging";
import { getMessagingClient } from "@/src/firebase/messaging";
import UserProfileSidebar from "../component/UserProfileSidebar";

const ChatContainer: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [currentUserId, setCurrentUserId] = useState("");
    const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [originalText, setOriginalText] = useState<string | null>(null);
    const [showProfile, setShowProfile] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Get logged-in user ID
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const user = await Api.auth.getCurrentUserData();
            if (user?.id) {
                setCurrentUserId(user.id);
            }
        };
        fetchCurrentUser();
        scrollToBottom();
    }, [messages, selectedUser]);

    // Listen to messages when selectedUser changes
    useEffect(() => {
        if (!currentUserId || !selectedUser) return;

        const chatId = Api.Chat.getChatId(currentUserId, selectedUser.id);

        // Mark messages as read when opening the chat
        Api.Chat.markMessagesAsRead(chatId, currentUserId);

        // Cleanup old listener
        if (unsubscribe) unsubscribe();

        const unsub = Api.Chat.listenToMessages(
            currentUserId,
            selectedUser.id,
            (msgs) => setMessages(msgs)
        );

        setUnsubscribe(() => unsub);

        return () => {
            unsub();
        };
    }, [selectedUser, currentUserId]);

    // Handle file selection (NO API CALL)
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);

        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => setFilePreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setFilePreviewUrl(null); // PDF/text – just show filename
        }
    };

    useEffect(() => {
        const listen = async () => {
            const messaging = await getMessagingClient();
            if (messaging) {
                onMessage(messaging, (payload) => {
                    console.log("Message received. ", payload);
                    // Show a toast notification

                    toast?.success?.((t) => (
                        <div
                            className={`${t.visible ? "animate-enter" : "animate-leave"
                                } max-w-md w-full bg-white shadow-md rounded-lg p-6 flex flex-col border-l-4 border-purple-600`}
                        >
                            <div className="text-purple-800 font-bold text-sm">
                                {payload.notification?.title}
                            </div>
                            <div className="text-gray-700 text-sm mt-1">
                                {payload.notification?.body}
                            </div>
                        </div>
                    ));
                });
            }
        };
        listen();
    }, []);

    const handleEditMessages = (messageId: string, oldText: string) => {
        // Toggle behavior on same message
        if (editingMessageId === messageId) {
            setEditingMessageId(null);
            setInput("");
            setOriginalText(null);
        } else {
            setEditingMessageId(messageId);
            setInput(oldText);
            setOriginalText(oldText);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!input.trim() || !selectedUser) return;
        const chatId = Api.Chat.getChatId(currentUserId, selectedUser.id);

        if (editingMessageId) {
            // If text hasn't changed, cancel editing
            if (input.trim() === originalText) {
                setEditingMessageId(null);
                setInput("");
                setOriginalText(null);
                return;
            }

            await Api.Chat.editMessage(chatId, editingMessageId, input.trim());
            toast.success("Message updated!");
            setEditingMessageId(null);
            setOriginalText(null);
        } else {
            await Api.Chat.sendMessage(currentUserId, selectedUser.id, input.trim());
            toast.success("Message sent!");
        }

        setInput("");
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (
            confirm("Are you sure you want to delete this message?") &&
            selectedUser
        ) {
            const chatId = Api.Chat.getChatId(currentUserId, selectedUser.id);
            await Api.Chat.deleteMessage(chatId, messageId);
        }
    };

    return (
        <div className="flex h-screen md:h-[570px] ">
            <Sidebar
                currentUserId={currentUserId}
                // onSelectUser={setSelectedUser}
                onSelectUser={(user) => {
                    setSelectedUser(user);
                    setShowProfile(false); // reset profile view
                }}
            />

            <div className="flex flex-col flex-1">
                <div
                    onClick={() => setShowProfile((prev) => !prev)}
                    className="p-4 border-b font-semibold cursor-pointer"
                >
                    {selectedUser ? selectedUser.name : "Select a user to chat"}
                </div>

                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {messages.map((msg) => (
                        <ChatBubble
                            key={msg.id}
                            id={msg.id}
                            isSender={msg.senderId === currentUserId}
                            message={msg.text}
                            image={msg.imageUrl}
                            onEdit={handleEditMessages}
                            onDelete={handleDeleteMessage}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {selectedUser && (
                    <div className="p-3 border-t flex items-center">
                        {/* Image or file preview */}
                        {selectedFile && (
                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border">
                                {filePreviewUrl ? (
                                    <img
                                        src={filePreviewUrl}
                                        alt="preview"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="text-xs p-2 text-gray-600">
                                        📄 {selectedFile.name}
                                    </div>
                                )}
                            </div>
                        )}
                        {/* // select the image or pdf select add the plus button */}
                        <label className="bg-gray-200 rounded-full p-2 mr-2 cursor-pointer">
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleFileSelect}
                                hidden
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </label>

                        {/* // select the image or pdf select */}

                        <input
                            className="flex-1 border rounded-lg px-4 py-2 mr-2"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-[#6E11B0] cursor-pointer text-white px-4 py-2 rounded-lg"
                        >
                            {editingMessageId ? "Update" : "Send"}
                        </button>
                    </div>
                )}
            </div>

            {/* Right Profile Sidebar */}
            {showProfile && selectedUser && (
                <UserProfileSidebar user={selectedUser} />
            )}
        </div>
    );
};

export default ChatContainer;
