import React, { useState, useEffect, useRef } from "react";
import { fetchUserStatus, setupSSE } from "../Components/Api/chatServies";

const ChatWindow = ({ chat, webSocket, messages, setMessages, chatId }) => {
  const [newMessage, setNewMessage] = useState("");
  const [userStatus, setUserStatus] = useState({ online: false, last_seen: null });
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("currentLoggedInUser");
  const chatUser = localStorage.getItem("chatUser");
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    const getUserStatus = async () => {
      try {
        const status = await fetchUserStatus(chatUser);
        setUserStatus(status);
      } catch (error) {
        console.error(error);
      }
    };

    getUserStatus();
  }, [chatUser]);

  useEffect(() => {
    if (!chatUser) return;

    const handleMessage = (data) => setUserStatus(data);
    const handleError = (error) => console.error("SSE Error:", error);

    const eventSource = setupSSE(chatUser, handleMessage, handleError);

    return () => eventSource.close();
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
      webSocket.send(JSON.stringify(message));
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } else {
      console.error("WebSocket is not open");
    }
  };       return (
        <div className="bg-[#B1C381] h-screen flex flex-col">
  {/* Shapes Background */}
  <div className="absolute inset-0 z-[-1]">
    <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-[#5C8374] rounded-full opacity-70"></div>
    <div className="absolute top-1/3 right-0 w-[200px] h-[200px] bg-[#9EC8B9] rounded-full opacity-50"></div>
    <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-[#1B4242] rounded-full opacity-60"></div>
  </div>

  {/* Header Section */}
  <div className="flex items-center bg-[#1B4242] p-4 shadow-md">
    <img
      src={chat.image}
      alt={`${chat.name} avatar`}
      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
    />
    <h1 className="text-xl font-bold text-white">{chat.name}</h1>
    <div className="ml-auto flex items-center cursor-pointer">
      {/* Close Button */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        <div className="absolute w-4 h-1 bg-gray-300 rounded transform rotate-45"></div>
        <div className="absolute w-4 h-1 bg-gray-300 rounded transform rotate-135"></div>
      </div>
    </div>
  </div>

  {/* User Status */}
  <div className="text-gray-500 mb-4 p-2">
    {userStatus.online ? (
      <span>User is online</span>
    ) : (
      <span>
        User was last seen at{" "}
        {userStatus.last_seen ? new Date(userStatus.last_seen).toLocaleTimeString() : "unknown time"}
      </span>
    )}
  </div>

  {/* Messages Section */}
  <div className="flex-grow overflow-y-auto custom-scrollbar mb-4 px-4">
    {messages.length > 0 ? (
      <ul className="space-y-2">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`flex ${msg.sender === userEmail ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-2 max-w-[70%] rounded-lg ${
                msg.sender === userEmail ? "bg-[#5C8374]" : "bg-[#5C8374]/60"
              }`}
            >
              <p className="text-white">{msg.content}</p>
              <small className="text-xs text-gray-200">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
    ) : (
      <div className="text-gray-500 text-center">No messages yet</div>
    )}
  </div>

  {/* Sender Area */}
  <div className="flex items-center gap-2 p-4 bg-[#40414F] border-t border-gray-700">
    {/* Input Box */}
    <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Type a message"
      className="w-full p-3 rounded-lg bg-[#5C8374] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#9EC8B9] focus:outline-none"
    />

    {/* Send Button with Icon */}
    <button
      onClick={sendMessage}
      className="flex items-center justify-center p-3 bg-gradient-to-r from-[#1B4242] to-[#5C8374] text-white rounded-lg shadow-md hover:opacity-90 transition duration-300"
    >
      <svg
        className="w-5 h-5 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="#ffffff"
          d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.309,8.287C2.86,59.547-3.098,78.551,1.558,96.808
          L38.327,241h180.026c8.284,0,15.001,6.716,15.001,15.001c0,8.284-6.716,15.001-15.001,15.001H38.327L1.558,415.193
          c-4.656,18.258,1.301,37.262,15.547,49.595c14.274,12.357,33.937,15.495,51.31,8.287l413.094-171.409
          C500.317,293.862,512,276.364,512,256.001C512,235.638,500.317,218.139,481.508,210.336z"
        ></path>
      </svg>
    </button>
  </div>
</div>

      

    );
};

export default ChatWindow;