import React, { useState } from "react";
import CallsList from "../Components/calls";
import CallInfo from "../Components/callinfo";

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Chats List */}
            <div className="ml-20 w-1/3 border-r border-gray-700">
                <CallsList setSelectedChat={setSelectedChat} />
            </div>

            {/* Chat Window */}
            <div className="w-2/3">
                {selectedChat ? (
                    <CallInfo chat={selectedChat} />
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
