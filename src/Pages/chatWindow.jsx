import React, { useState, useEffect, useRef } from "react";
// import { fetchUserStatus } from "../Components/Api/chatServies.js";
import "./scrollBar.css"

const ChatWindow = ({ chat, webSocket, messages, setMessages, chatId }) => {
    const [newMessage, setNewMessage] = useState("");
    const [userStatus, setUserStatus] = useState({ online: false, last_seen: null });
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("email");
    const chatUser = sessionStorage.getItem("chatUser");
    const messagesEndRef = useRef(null);

    // Scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (webSocket) {
            webSocket.onmessage = (event) => {
                const receivedMessage = JSON.parse(event.data);
                if (receivedMessage.sender !== userEmail) {
                    setMessages((prev) => [...prev, receivedMessage]);
                }
            };
        }
    }, [webSocket, setMessages]);

    // Fetch user status
    // useEffect(() => {
    //     const fetchStatus = async () => {
    //         try {
    //             const status = await fetchUserStatus(chatUser); // Use the service function
    //             setUserStatus(status);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    //     fetchStatus();
    //     const interval = setInterval(fetchStatus, 60000);
    //     return () => clearInterval(interval);
    // }, [chatUser]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const message = {
            chatId: chatId,
            content: newMessage,
            timestamp: new Date().toISOString(),
            sender: userEmail,
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
        <div className="  bg-[#B1C381] ">

<div className="flex items-center bg-[#1B4242] p-4  shadow-md">
  <img
    src={chat.image}
    alt={`${chat.name} avatar`}
    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
  />
  <h1 className="text-xl font-bold text-white">
    {chat.name}
  </h1>
</div>

            
            {/* <div className="text-gray-500 mb-4">
                {userStatus.online ? (
                    <span>User is online</span>
                ) : (
                    <span>
                        User was last seen at{" "}
                        {userStatus.last_seen ? new Date(userStatus.last_seen).toLocaleTimeString() : "unknown time"}
                    </span>
                )}
            </div> */}
            <div className="h-[calc(105vh-200px)] overflow-y-auto custom-scrollbar mb-4">
                {messages.length > 0 ? (
                    <ul className="space-y-2">
                        {messages.map((msg, index) => (
                            <li
                                key={index}
                                className={`flex ${msg.sender === userEmail ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`p-2 rounded-lg ${
                                        msg.sender === userEmail ? "bg-[#5C8374]" : "bg-[#5C8374]/60"
                                    }`}
                                >
                                    <p>{msg.content}</p>
                                    <small className="text-xs text-white">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </small>
                                </div>
                            </li>
                        ))}
                        <div ref={messagesEndRef} />
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
                    className="w-full p-2   bg-[#5C8374] text-white"
                />
                <button
  onClick={sendMessage}
  className="p-2 bg-[#5C8374] text-white rounded-lg ml-2 px-4 shadow-md hover:opacity-90 transition-opacity duration-300"
>
  Send
</button>

            </div>
        </div>
    );
};

export default ChatWindow;
