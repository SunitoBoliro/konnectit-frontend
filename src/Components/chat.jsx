import React, { useEffect, useState } from "react";
import { fetchChats } from "../Components/Api/chatServies";

// Ensure that Chats component calls setSelectedChat to update the chat
const Chats = ({ setSelectedChat }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const loadChats = async () => {
            try {
                const data = await fetchChats();
                setChats(data);
            } catch (error) {
                console.error("Failed to load chats:", error);
            }
        };

        loadChats();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Chats</h1>
            <input
                type="text"
                placeholder="Search"
                className="w-full p-2 mb-4 rounded-lg bg-gray-800 text-white border-none"
            />
            <ul className="space-y-2">
                {chats.map((chat) => (
                    <li
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
                    >
                        <img
                            src="https://placehold.co/40x40"
                            alt={chat.name}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <div className="font-semibold">{chat.name}</div>
                            <div className="text-sm text-gray-400">{chat.message}</div>
                        </div>
                        <div className="ml-auto text-sm text-gray-500">{chat.time}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default Chats;
