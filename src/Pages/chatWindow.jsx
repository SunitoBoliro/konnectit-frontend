<<<<<<< HEAD
import React, { useState } from "react";

const ChatWindow = ({ chat, webSocket, messages, setMessages }) => {
    const [newMessage, setNewMessage] = useState("");
    const userId = localStorage.getItem("userId");

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const message = {
            chatId: chat.id,
            content: newMessage,
            timestamp: new Date().toISOString(),
            sender: userId,
        };

        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            webSocket.send(JSON.stringify(message));
            setMessages([...messages, message]);
            setNewMessage("");
        } else {
            console.error("WebSocket is not open");
=======
// import React, { useState } from "react";
// import MessageInput from "./MessageInput";
// import { sendMessageApi } from "../Components/Api/chatServies";

// const ChatWindow = ({ chat }) => {
//     const [messages, setMessages] = useState([
//         { sender: "bot", text: "Hello! How can I assist you today?" },
//     ]);

//     const sendMessage = async (message) => {
//         setMessages([...messages, { sender: "user", text: message }]);

//         try {
//             const response = await sendMessageApi(chat.id, message);
//             setMessages((prev) => [...prev, { sender: "bot", text: response.reply }]);
//         } catch (error) {
//             console.error("Error sending message:", error);
//             setMessages((prev) => [...prev, { sender: "bot", text: "Failed to send message" }]);
//         }
//     };

//     return (
//         <div className="flex flex-col h-full">
//             {/* Header */}
//             <div className="p-4 bg-gray-800 flex items-center">
//                 <img
//                     src="https://placehold.co/40x40"
//                     alt={chat.name}
//                     className="w-10 h-10 rounded-full mr-3"
//                 />
//                 <div>
//                     <h2 className="text-lg font-bold">{chat.name}</h2>
//                     <p className="text-sm text-gray-400">Last seen just now</p>
//                 </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
//                 {messages.map((msg, index) => (
//                     <div
//                         key={index}
//                         className={`mb-4 p-3 rounded-lg shadow-lg ${
//                             msg.sender === "user"
//                                 ? "bg-blue-500 text-white self-end"
//                                 : "bg-gray-700 text-white self-start"
//                         }`}
//                     >
//                         {msg.text}
//                     </div>
//                 ))}
//             </div>

//             {/* Input */}
//             <MessageInput sendMessage={sendMessage} />
//         </div>
//     );
// };

// export default ChatWindow;


import React, { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import { sendMessageApi, createWebSocketConnection } from "../Components/Api/chatServies";

const ChatWindow = ({ chat }) => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! How can I assist you today?" },
    ]);
    const [socket, setSocket] = useState(null);

    // Establish WebSocket connection
    useEffect(() => {
        const ws = createWebSocketConnection();
        setSocket(ws);

        // Listen for messages from WebSocket
        ws.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            setMessages((prev) => [...prev, { sender: "bot", text: receivedMessage.text }]);
        };

        // Clean up WebSocket on component unmount
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const sendMessage = async (message) => {
        setMessages([...messages, { sender: "user", text: message }]);

        try {
            const response = await sendMessageApi(chat.id, message);
            setMessages((prev) => [...prev, { sender: "bot", text: response.reply }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [...prev, { sender: "bot", text: "Failed to send message" }]);
        }

        // Send the message through WebSocket
        if (socket) {
            socket.send(JSON.stringify({ chatId: chat.id, message }));
>>>>>>> 6100f5566c7cafc5f599de64521d323147a20dee
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Chat with {chat.name}</h1>
            <div className="h-80 overflow-y-auto mb-4">
                <ul className="space-y-2">
                    {messages.map((msg, index) => (
                        <li key={index} className={`flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}>
                            <div className={`p-2 rounded-lg ${msg.sender === userId ? "bg-blue-500 text-white" : "bg-gray-800 text-white"}`}>
                                <p>{msg.content}</p>
                                <small className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</small>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="w-full p-2 rounded-lg bg-gray-800 text-white border-none"
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

