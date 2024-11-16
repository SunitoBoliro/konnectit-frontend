import React, { useState } from "react";
import Chats from "../Components/chat";
import ChatWindow from "./chatWindow";

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Chats List */}
            <div className="ml-20 w-1/3 border-r border-gray-700">
                <Chats setSelectedChat={setSelectedChat} />
            </div>

            {/* Chat Window */}
            <div className="w-2/3">
                {selectedChat ? (
                    <ChatWindow chat={selectedChat} />
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
