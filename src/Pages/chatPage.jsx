import React, { useState, useEffect } from "react";
import { fetchUsers, fetchMessages, joinChat } from "../Components/Api/chatServies";
import { connectWebSocket } from "../Components/Api/webSocket/index";
import Chats from "../Components/chat";
import ChatWindow from "./chatWindow";
// import CallModal from "./CallModal"; // Import the CallModal component
import CallModal from "../Components/callModal.jsx"

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [webSocket, setWebSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [chatId, setChatId] = useState("");
    const [isCallModalOpen, setIsCallModalOpen] = useState(false); // State to control the call modal

    localStorage.setItem("chatUser", selectedChat?.email || "");

    const fetchUsersData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token not found in local storage");
            const data = await fetchUsers(token);
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError(error.response?.data?.detail || "Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchUsersData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Token not found in local storage");
            return;
        }

        const onMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        const onError = (errorMessage) => {
            setError(errorMessage);
        };

        const onClose = () => {
            console.error("WebSocket closed.");
        };

        const ws = connectWebSocket(token, onMessage, onError, onClose);
        setWebSocket(ws);

        // Cleanup WebSocket connection
        return () => {
            if (ws) ws.close();
        };
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessagesData(selectedChat.email);
        }
    }, [selectedChat]);

    const fetchMessagesData = async (chatId) => {
        try {
            const token = localStorage.getItem("token");
            const sender = localStorage.getItem("currentLoggedInUser");
            const data = await fetchMessages(chatId, sender, token);
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError(error.response?.data?.detail || "Failed to fetch messages");
        }
    };

    const handleChatSelection = async (user) => {
        const chatId = user.email;
        setChatId(chatId);

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("currentLoggedInUser");

        if (!token || !userId) {
            setError("Token or User ID not found in local storage");
            return;
        }

        try {
            const data = await joinChat(userId, chatId, token);
            const createdChatId = data.chatId;
            setSelectedChat({ chatId: createdChatId, name: user.username, email: user.email });
            setMessages([]); // Clear previous messages when a new chat is selected
        } catch (error) {
            console.error("Error creating chat:", error);
            setError(error.response?.data?.detail || "Failed to create chat");
        }
    };

    const refreshChats = () => {
        fetchUsersData(); // Refresh the list of users/chats
    };

    const handleCallInitiation = () => {
        setIsCallModalOpen(true);
    };

    return (
        <div className="flex h-screen bg-[#1B4242] text-white">
            <div className="ml-20 w-1/3 border-r border-gray-700 custom-scrollbar">
                <Chats users={users} setSelectedChat={handleChatSelection} refreshChats={refreshChats} />
                {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
            </div>

            <div className="w-2/3 flex flex-col">
                {selectedChat ? (
                    <ChatWindow
                        chat={selectedChat}
                        webSocket={webSocket}
                        messages={messages}
                        setMessages={setMessages}
                        chatId={chatId}
                        users={users}
                        handleCallInitiation={handleCallInitiation} // Pass the handleCallInitiation function to ChatWindow
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-white bg-[#1B4242] rounded-lg shadow-lg">
                        Select a chat to start messaging.
                    </div>
                )}
            </div>

            {/* Render the CallModal component if it's open */}
            {isCallModalOpen && (
                <CallModal
                    chatUser={selectedChat?.email}
                    currentLoggedInUser = {localStorage.getItem("currentLoggedInUser")}
                    onClose={() => setIsCallModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ChatPage;