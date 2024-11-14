import { useState } from 'react';
import MessageInput from './messageInput';
import "./chatWindow.jsx"
export default function ChatWindow() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I assist you today?' }
    ]);

    const sendMessage = (message) => {
        setMessages([...messages, { sender: 'user', text: message }]);
        // Bot response (for example purposes)
        setTimeout(() => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: "I'm here to help!" }
            ]);
        }, 500);
    };

    return (
        <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800 h-screen p-6">
            <div className="flex-1 p-4 overflow-y-auto border-4 border-teal-500 rounded-lg shadow-lg bg-gray-800 neon-border">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-4 p-3 rounded-xl text-lg shadow-md transition-all duration-300 neon-text 
                            ${msg.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-teal-500 text-white self-start'}`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <MessageInput sendMessage={sendMessage} />
        </div>
    );
}
