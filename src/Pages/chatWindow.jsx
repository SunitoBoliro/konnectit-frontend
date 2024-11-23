import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatWindow = ({ chat, webSocket, messages, setMessages, chatId }) => {
    const [newMessage, setNewMessage] = useState("");
    const [userStatus, setUserStatus] = useState({ online: false, last_seen: null });
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("currentLoggedInUser");
    const chatUser = localStorage.getItem("chatUser");
    const messagesEndRef = useRef(null); // Ref to track the end of the message list

    // Automatically scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Automatically listen for incoming WebSocket messages and update the state
    useEffect(() => {
        if (webSocket) {
            webSocket.onmessage = (event) => {
                const receivedMessage = JSON.parse(event.data);

                // Prevent the sender from seeing their own message again
                if (receivedMessage.sender !== userEmail) {
                    setMessages((prev) => [...prev, receivedMessage]);
                }
            };
        }
    }, [webSocket, setMessages]);

    // Fetch initial user status from the backend
    useEffect(() => {
        const fetchInitialUserStatus = async () => {
            try {
                const response = await axios.get(`http://192.168.23.109:8000/user-status/${chatUser}`);
                console.log("Initial User Status:", response.data);
                setUserStatus(response.data);
            } catch (error) {
                console.error("Error fetching initial user status:", error);
            }
        };

        fetchInitialUserStatus();
    }, [chatUser]);

    // Set up SSE for real-time user status updates
    useEffect(() => {
        if (!chatUser) return;

        const eventSource = new EventSource(`http://192.168.23.109:8000/sse/user-status/${chatUser}`);

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('User Status Update:', data);
                setUserStatus(data);
            } catch (parseError) {
                console.error('Error parsing SSE message:', parseError);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [chatUser]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const message = {
            chatId: chatUser,
            content: newMessage,
            timestamp: new Date().toISOString(),
            sender: userEmail,
        };

        if (webSocket?.readyState === WebSocket.OPEN) {
            webSocket.send(JSON.stringify(message)); // Send message to WebSocket server

            // Only add the message to the state once it has been successfully sent to the server
            setMessages((prev) => [...prev, message]);

            setNewMessage(""); // Clear the input field
        } else {
            console.error("WebSocket is not open");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Chat with {chat.name}</h1>
            <div className="text-gray-500 mb-4">
                {userStatus.online ? (
                    <span>User is online</span>
                ) : (
                    <span>User was last seen at {userStatus.last_seen ? new Date(userStatus.last_seen).toLocaleTimeString() : "unknown time"}</span>
                )}
            </div>
            <div className="h-[calc(100vh-200px)] overflow-y-auto mb-4">
                {messages.length > 0 ? (
                    <ul className="space-y-2">
                        {messages.map((msg, index) => (
                            <li
                                key={index}
                                className={`flex ${msg.sender === userEmail ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`p-2 rounded-lg ${
                                        msg.sender === userEmail ? "bg-blue-500" : "bg-gray-800"
                                    }`}
                                >
                                    <p>{msg.content}</p>
                                    <small className="text-xs text-gray-400">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </small>
                                </div>
                            </li>
                        ))}
                        {/* Invisible div to ensure scrolling works */}
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