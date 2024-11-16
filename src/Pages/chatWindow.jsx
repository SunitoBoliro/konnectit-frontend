import React, { useState } from "react";
import MessageInput from "./MessageInput";

const ChatWindow = ({ chat }) => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! How can I assist you today?" },
    ]);

    const sendMessage = (message) => {
        setMessages([...messages, { sender: "user", text: message }]);
        setTimeout(() => {
            setMessages((prev) => [...prev, { sender: "bot", text: "I'm here to help!" }]);
        }, 500);
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
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* Input */}
            <MessageInput sendMessage={sendMessage} />
        </div>
    );
};

export default ChatWindow;
