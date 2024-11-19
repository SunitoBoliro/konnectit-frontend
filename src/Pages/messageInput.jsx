import React, { useState } from "react";

const MessageInput = ({ sendMessage }) => {
    const [inputValue, setInputValue] = useState("");

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            sendMessage(inputValue);
            setInputValue("");
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="p-4 bg-gray-800 flex items-center">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded mr-2"
            />
            <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Send
            </button>
        </div>
    );
};

export default MessageInput;