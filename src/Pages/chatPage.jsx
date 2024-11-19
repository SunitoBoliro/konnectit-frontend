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
    const [retryCount, setRetryCount] = useState(0);
    const [chatId, setChatId] = useState("")

    useEffect(() => {
        // Fetch users from the backend
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Token not found in local storage");
                }
                const response = await axios.get("http://192.168.23.109:8000/users", {
                    params: { token: encodeURIComponent(token) }
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError(
                    error.response?.data?.detail || "Failed to fetch users"
                );
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Token not found in local storage");
            return;
        }

        const connectWebSocket = () => {
            console.log("Connecting to WebSocket...");
            const ws = new WebSocket(`ws://192.168.23.109:8000/ws/${encodeURIComponent(token)}`);

            ws.onopen = () => {
                console.log("Connected to WebSocket server");
                setError("");
                setRetryCount(0);
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("Received message:", message);
                setMessages((prevMessages) => [...prevMessages, message]);
            };

            ws.onclose = () => {
                console.error("WebSocket closed. Attempting to reconnect...");
                // setRetryCount((prev) => prev + 1);
                //
                // // Retry with exponential backoff
                // const retryTimeout = Math.min(1000 * Math.pow(2, retryCount), 30000);
                // setTimeout(connectWebSocket, retryTimeout);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                setError("WebSocket error. Check server or network.");
            };

            setWebSocket(ws);

            return () => {
                ws.close();
                // console.log("closed comment ws ion chatPage file line 80")
            };
        };

        connectWebSocket();

        // Cleanup function
        return () => {
            if (webSocket) webSocket.close();
        };
    }, [retryCount]);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.email);
        }
    }, [selectedChat]);

    const fetchMessages = async (chatId) => {
        try {
            const token = localStorage.getItem("token");
            const sender = localStorage.getItem("email")
            const response = await axios.get(`http://192.168.23.109:8000/messages/${chatId}/${sender}`, {
                params: { token: encodeURIComponent(token) }
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError(error.response?.data?.detail || "Failed to fetch messages");
        }
    };

    const handleChatSelection = async (user) => {
        const chatId = user.email;  // Use the recipient's email as the chatId
        setChatId(chatId)

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            setError("Token or User ID not found in local storage");
            return;
        }

        try {
            const response = await axios.post(
                `http://192.168.23.109:8000/chats/${userId}/join`,
                { chatId },
                { params: { token: encodeURIComponent(token) } }
            );
            const createdChatId = response.data.chatId;
            setSelectedChat({ id: createdChatId, name: user.username, email: user.email });
            setMessages([]);  // Clear previous messages when a new chat is selected
        } catch (error) {
            console.error("Error creating chat:", error);
            setError(error.response?.data?.detail || "Failed to create chat");
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
                        chatId={chatId}
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
