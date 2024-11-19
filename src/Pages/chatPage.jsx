import React, { useState, useEffect } from "react";
import { fetchUsers, fetchMessages, joinChat } from "../Components/Api/chatServies";
import { connectWebSocket } from "../Components/Api/webSocket/index";
import Chats from "../Components/chat";
import ChatWindow from "./chatWindow";
import "./scrollBar.css"

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [webSocket, setWebSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [chatId, setChatId] = useState("");

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersData = await fetchUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError(error.message || "Failed to fetch users");
            }
        };
        loadUsers();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Token not found in local storage");
            return;
        }

        const ws = connectWebSocket(
            token,
            (message) => setMessages((prev) => [...prev, message]),
            (error) => setError("WebSocket error. Check server or network."),
            () => console.error("WebSocket closed. Attempting to reconnect..."),
            () => setError("")
        );

        setWebSocket(ws);

        return () => {
            if (ws) ws.close();
        };
    }, []);

    const handleChatSelection = async (user) => {
        try {
            const chatId = user.email;
            setChatId(chatId);

            const userId = localStorage.getItem("userId");
            const chatData = await joinChat(userId, chatId);

            setSelectedChat({ id: chatData.chatId, name: user.username, email: user.email });
            setMessages([]); // Clear previous messages when a new chat is selected
        } catch (error) {
            console.error("Error creating chat:", error);
            setError(error.message || "Failed to create chat");
        }
    };

    useEffect(() => {
        const loadMessages = async () => {
            if (selectedChat) {
                try {
                    const sender = localStorage.getItem("email");
                    const messagesData = await fetchMessages(selectedChat.email, sender);
                    setMessages(messagesData);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                    setError(error.message || "Failed to fetch messages");
                }
            }
        };
        loadMessages();
    }, [selectedChat]);

    return (
        <div className="flex h-screen bg-[#1B4242] text-white">
            {/* Sidebar with Chats */}
            <div className="ml-20 w-1/3 border-r border-gray-700 custom-scrollbar">
                <Chats users={users} setSelectedChat={handleChatSelection} />
                {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
            </div>

            {/* Chat Window */}
            <div className="w-2/3 flex flex-col">
                {selectedChat ? (
                    <ChatWindow
                        chat={selectedChat}
                        webSocket={webSocket}
                        messages={messages}
                        setMessages={setMessages}
                        chatId={chatId}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 bg-[#1B4242] rounded-lg shadow-lg">
                        Select a chat to start messaging.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
