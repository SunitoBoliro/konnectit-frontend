import React, { useState } from "react";

const ChatWindow = ({ chat, webSocket, messages, setMessages }) => {
    const [newMessage, setNewMessage] = useState("");
    const userId = localStorage.getItem("userId");

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const message = {
            chatId: chat.id,
            content: newMessage,
            timestamp: new Date().toISOString(),
            sender: userId,
        };

        if (webSocket?.readyState === WebSocket.OPEN) {
            webSocket.send(JSON.stringify(message));
            setMessages((prev) => [...prev, message]);
            setNewMessage("");
        } else {
            console.error("WebSocket is not open");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Chat with {chat.name}</h1>
            <div className="h-80 overflow-y-auto mb-4">
                {messages.length > 0 ? (
                    <ul className="space-y-2">
                        {messages.map((msg, index) => (
                            <li
                                key={index}
                                className={`flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`p-2 rounded-lg ${
                                        msg.sender === userId ? "bg-blue-500" : "bg-gray-800"
                                    }`}
                                >
                                    <p>{msg.content}</p>
                                    <small className="text-xs text-gray-400">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </small>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-gray-500">No messages yet</div>
                )}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="w-full p-2 rounded-lg bg-gray-800 text-white"
                />
                <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-500 text-white rounded-lg ml-2"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
