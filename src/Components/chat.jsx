<<<<<<< HEAD
import React, { useState } from "react";

const Chats = ({ users, setSelectedChat }) => {
    const [search, setSearch] = useState("");

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );
=======
import React, { useEffect, useState } from "react";
import { fetchChats } from "../Components/Api/chatServies";

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
>>>>>>> 6100f5566c7cafc5f599de64521d323147a20dee

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Chats</h1>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full p-2 mb-4 rounded-lg bg-gray-800 text-white border-none"
            />
            <ul className="space-y-2">
                {filteredUsers.map((user) => (
                    <li
                        key={user.id}
                        onClick={() => setSelectedChat(user)}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
                    >
                        <img
                            src="https://placehold.co/40x40"
                            alt={user.username}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <div className="font-semibold">{user.username}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Chats;
