import React, { useState, useEffect } from "react";
import axios from "axios";
import Chats from "../Components/chat";
import ChatWindow from "./chatWindow";

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [webSocket, setWebSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Token not found in local storage");

                const response = await axios.get("http://192.168.23.109:8000/users", {
                    params: { token },
                });
                setUsers(response.data);
            } catch (err) {
                handleError(err, "Failed to fetch users");
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const ws = new WebSocket(`ws://192.168.23.109:8000/ws/${encodeURIComponent(token)}`);

        ws.onopen = () => console.log("Connected to WebSocket server");
        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, message]);
            } catch (err) {
                console.error("Error parsing WebSocket message:", err);
            }
        };
        ws.onclose = () => console.log("Disconnected from WebSocket server");
        ws.onerror = (err) => handleError(err, "WebSocket error");

        setWebSocket(ws);

        return () => ws.close();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id);
        }
    }, [selectedChat]);

    const handleError = (error, defaultMessage) => {
        console.error(error);
        setError(error.response?.data?.detail || defaultMessage);
    };

    const fetchMessages = async (chatId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token not found in local storage");

            const response = await axios.get(`http://192.168.23.109:8000/messages/${chatId}`, {
                params: { token },
            });
            setMessages(response.data);
        } catch (err) {
            handleError(err, "Failed to fetch messages");
        }
    };

    const handleChatSelection = async (user) => {
        const chatId = user.email;

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            setError("Token or User ID not found in local storage");
            return;
        }

        try {
            await axios.post(
                `http://192.168.23.109:8000/chats/${userId}/join`,
                { chatId },
                { params: { token } }
            );
            setSelectedChat({ id: chatId, name: user.username, email: user.email });
            setMessages([]);
        } catch (err) {
            handleError(err, "Failed to join chat");
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <div className="ml-20 w-1/3 border-r border-gray-700">
                <Chats users={users} setSelectedChat={handleChatSelection} />
                {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
            </div>
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
