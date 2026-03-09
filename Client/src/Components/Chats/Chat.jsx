import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import io from "socket.io-client";
import axios from "axios";
import { CHAT_URLS } from "../../config";

const socket = io(CHAT_URLS.SERVER);

const Chat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [senderEmail, setSenderEmail] = useState(localStorage.getItem("userEmail")?.toLowerCase().trim() || "");
    const [receiverEmail, setReceiverEmail] = useState(location.state?.receiverEmail?.toLowerCase().trim() || "");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState([]); // Real-time online users
    const messagesEndRef = useRef(null);

    // Fetch conversation list
    const fetchChatList = async () => {
        if (!senderEmail) return;
        try {
            const response = await axios.get(CHAT_URLS.CHATS_LIST(senderEmail));
            setChatList(response.data);
        } catch (err) {
            console.error("Error fetching chat list:", err);
        } finally {
            setLoadingChats(false);
        }
    };

    useEffect(() => {
        fetchChatList();

        // Re-fetch chat list periodically or on certain events if needed
        const interval = setInterval(fetchChatList, 10000); // Optional: poll every 10s as backup
        return () => clearInterval(interval);
    }, [senderEmail]);

    useEffect(() => {
        console.log("Setting up socket listeners...");

        socket.on("load_messages", (data) => {
            console.log("Received load_messages:", data.length, "messages");
            setMessages(data);
        });

        socket.on("receive_message", (data) => {
            console.log("Received receive_message:", data);

            // If the message is for the current active chat, add it to the view
            const currentRoomId = [senderEmail, receiverEmail].sort().join("_");
            if (data.roomId === currentRoomId) {
                setMessages((prev) => [...prev, data]);
            }

            // Always refresh the sidebar to show the latest message
            fetchChatList();
        });

        socket.on("online_users", (users) => {
            console.log("Online users updated:", users);
            setOnlineUsers(users);
        });

        // Join room once emails are available
        if (senderEmail) {
            console.log(`📡 Emitting user_online for ${senderEmail}`);
            socket.emit("user_online", senderEmail);

            if (receiverEmail) {
                console.log(`Joining chat: ${senderEmail} -> ${receiverEmail}`);
                socket.emit("join_chat", { senderEmail, receiverEmail });
            }
        }

        return () => {
            console.log("Cleaning up socket listeners...");
            socket.off("load_messages");
            socket.off("receive_message");
            socket.off("online_users");
        };
    }, [senderEmail, receiverEmail]);

    const handleSelectChat = (partnerEmail) => {
        setReceiverEmail(partnerEmail.toLowerCase().trim());
        setMessages([]); // Clear while loading
    };

    const sendMessage = () => {
        if (!message.trim()) return;
        if (!senderEmail || !receiverEmail) {
            alert("Set the sender and receiver emails first!");
            return;
        }

        const newMessage = {
            senderEmail,
            receiverEmail,
            message,
        };

        socket.emit("send_message", newMessage);
        setMessage("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!senderEmail) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to chat</h2>
                    <p className="text-gray-600">Access your messages and contact landlords seamlessly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 mt-16 overflow-hidden">
            {/* Sidebar: Chat List */}
            <div className="w-1/3 md:w-1/4 bg-white border-r flex flex-col shadow-sm">
                <div className="p-6 border-b bg-white">
                    <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loadingChats ? (
                        <div className="p-8 text-center text-gray-400">Loading chats...</div>
                    ) : chatList.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <p className="mb-2">No messages yet.</p>
                            <p className="text-sm">Start a chat from any property listing!</p>
                        </div>
                    ) : (
                        chatList.map((chat) => (
                            <div
                                key={chat.partnerEmail}
                                onClick={() => handleSelectChat(chat.partnerEmail)}
                                className={`p-4 cursor-pointer transition-all duration-200 flex items-center gap-3 border-b border-gray-50 hover:bg-blue-50/50 ${receiverEmail === chat.partnerEmail.toLowerCase() ? "bg-blue-50 border-r-4 border-r-blue-500" : ""
                                    }`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                        {chat.partnerEmail[0].toUpperCase()}
                                    </div>
                                    {onlineUsers.includes(chat.partnerEmail.toLowerCase()) && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-semibold text-gray-800 truncate text-sm">
                                            {chat.partnerEmail}
                                        </h3>
                                        <span className="text-[10px] text-gray-400">
                                            {chat.timestamp ? new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate italic">
                                        {chat.latestMessage || "No messages"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {receiverEmail ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b bg-white flex items-center gap-3 shadow-sm z-10">
                            <button
                                onClick={() => navigate('/api/properties/search-rent')}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-1"
                                title="Back to Properties"
                            >
                                <IoArrowBack size={24} className="text-gray-600" />
                            </button>
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                {receiverEmail[0].toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{receiverEmail}</h3>
                                <div className="flex items-center gap-2">
                                    {onlineUsers.includes(receiverEmail.toLowerCase()) ? (
                                        <>
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            <span className="text-xs text-green-600 font-medium">Online</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                            <span className="text-xs text-gray-400 font-medium">Offline</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fc] custom-scrollbar">
                            <div className="flex flex-col gap-4">
                                {messages.length === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="inline-block px-4 py-2 bg-white rounded-full text-xs text-gray-400 shadow-sm">
                                            New conversation started
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex flex-col ${msg.senderEmail === senderEmail ? "items-end" : "items-start"}`}
                                        >
                                            <div
                                                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm relative ${msg.senderEmail === senderEmail
                                                    ? "bg-blue-600 text-white rounded-tr-none"
                                                    : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed">{msg.message}</p>
                                                <span className={`text-[10px] mt-1 block ${msg.senderEmail === senderEmail ? "text-blue-100" : "text-gray-400"}`}>
                                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef}></div>
                            </div>
                        </div>

                        {/* Input Box */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-blue-400 transition-all">
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent p-2 text-sm focus:outline-none placeholder:text-gray-400"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                />
                                <button
                                    className={`p-2 rounded-xl transition-all ${message.trim() ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                    onClick={sendMessage}
                                    disabled={!message.trim()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 p-10 text-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 animate-bounce">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Select a conversation</h3>
                        <p className="text-gray-500 max-w-sm">Choose a landlord or tenant from the sidebar to start messaging in real-time.</p>
                    </div>
                )}
            </div>

            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};

export default Chat;
