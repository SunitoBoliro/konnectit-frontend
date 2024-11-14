// MessageInput.js
import { useState } from 'react';

export default function MessageInput({ sendMessage }) {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex items-center mt-4">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-lg border-none focus:outline-none neon-text shadow-inner"
            />
            <button
                onClick={handleSend}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 neon-button rounded-r-lg font-semibold text-white"
            >
                Send
            </button>
        </div>
    );
}
