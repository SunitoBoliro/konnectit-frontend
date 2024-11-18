import React, { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import { fetchMessages, sendMessageApi } from "../Components/Api/chatServies";

const ChatWindow = ({ chat }) => {
    const [messages, setMessages] = useState([]);
    const [lastChecked, setLastChecked] = useState(null); // Track the last fetched time

    // Poll for new messages
    useEffect(() => {
        let pollingInterval;

        const pollMessages = async () => {
            try {
                const newMessages = await fetchMessages(chat.id, lastChecked);
                if (newMessages && newMessages.length > 0) {
                    setMessages((prev) => [...prev, ...newMessages]);
                    setLastChecked(new Date().toISOString()); // Update last checked time
                }
            } catch (error) {
                console.error("Error polling messages:", error);
            }
        };

        // Start polling every 5 seconds
        pollingInterval = setInterval(pollMessages, 5000);

        return () => {
            clearInterval(pollingInterval); // Clean up on unmount
        };
    }, [chat.id, lastChecked]);

    const sendMessage = async (message) => {
        const senderId = 1; // Replace with actual sender ID logic
        const receiverId = 2; // Replace with actual receiver ID logic

        if (!senderId || !receiverId || !chat.id) {
            console.error("Required fields are missing");
            return;
        }

        setMessages([...messages, { sender: "user", text: message }]);

        try {
            const response = await sendMessageApi(chat.id, message, senderId, receiverId);
            setMessages((prev) => [...prev, { sender: "bot", text: response.reply }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [...prev, { sender: "bot", text: "Failed to send message" }]);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 bg-gray-800 flex items-center">
                <img
                    src="https://placehold.co/40x40"
                    alt={chat.name}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                    <h2 className="text-lg font-bold">{chat.name}</h2>
                    <p className="text-sm text-gray-400">Last seen just now</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-4 p-3 rounded-lg shadow-lg ${
                            msg.sender === "user"
                                ? "bg-blue-500 text-white self-end"
                                : "bg-gray-700 text-white self-start"
                        }`}
                    >
                        {msg.content || msg.text}
                    </div>
                ))}
            </div>

            {/* Input */}
            <MessageInput sendMessage={sendMessage} />
        </div>
    );
};

export default ChatWindow;
