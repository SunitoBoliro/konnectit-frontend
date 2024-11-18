// chatPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";  // Import axios
import Chats from "../Components/chat";
import ChatWindow from "./chatWindow";

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [webSocket, setWebSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch users from the backend
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Token not found in local storage");
                }
                const response = await axios.get("http://localhost:8000/users", {
                    params: { token: encodeURIComponent(token) }
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                if (error.response && error.response.data && error.response.data.detail) {
                    setError(error.response.data.detail);
                } else {
                    setError("Failed to fetch users");
                }
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        // Assuming you have a token stored in local storage
        const token = localStorage.getItem("token");
        if (token) {
            console.log("Token from local storage:", token);
            const ws = new WebSocket(`ws://localhost:8000/ws/${encodeURIComponent(token)}`);

            ws.onopen = () => {
                console.log("Connected to WebSocket server");
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("Received message:", message);
                // Handle incoming messages here
                setMessages((prevMessages) => [...prevMessages, message]);
            };

            ws.onclose = () => {
                console.log("Disconnected from WebSocket server");
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                setError("WebSocket error");
            };

            setWebSocket(ws);

            return () => {
                ws.close();
            };
        }
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.email);
        }
    }, [selectedChat]);

    const fetchMessages = async (chatId) => {
        try {
            const token = localStorage.getItem("token");
            console.log("Fetching messages with token:", token);
            const response = await axios.get(`http://localhost:8000/messages/${chatId}`, {
                params: { token: encodeURIComponent(token) }
            });
            setMessages(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
            if (error.response && error.response.data && error.response.data.detail) {
                setError(error.response.data.detail);
            } else {
                setError("Failed to fetch messages");
            }
        }
    };

    const handleChatSelection = async (user) => {
        // Create a new chat or select an existing one
        const chatId = user.email; // Create a new chat ID using timestamp

        // Add chatId to the current user's chats
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            setError("Token or User ID not found in local storage");
            return;
        }

        try {
            // Create a chat and add both users to it
            const response = await axios.post(`http://localhost:8000/chats/${userId}/join`, {
                chatId: chatId,
                other_user_id: user.id
            }, {
                params: { token: encodeURIComponent(token) }
            });

            const createdChatId = response.data.chatId;
            setSelectedChat({ id: createdChatId, name: user.username, email: user.email });
            setMessages([]); // Clear messages for the new chat
        } catch (error) {
            console.error("Error creating chat:", error);
            if (error.response && error.response.data && error.response.data.detail) {
                setError(error.response.data.detail);
            } else {
                setError("Failed to create chat");
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Chats List */}
            <div className="ml-20 w-1/3 border-r border-gray-700">
                <Chats users={users} setSelectedChat={handleChatSelection} />
                {error && (
                    <div className="mt-4 text-red-500 text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* Chat Window */}
            <div className="w-2/3">
                {selectedChat ? (
                    <ChatWindow
                        chat={selectedChat}
                        webSocket={webSocket}
                        messages={messages}
                        setMessages={setMessages}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a chat to start messaging.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;