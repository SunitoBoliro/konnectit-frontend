import React, { useEffect, useState } from "react";
import { fetchChats } from "../Components/Api/chatServies";

const Chats = ({ users, setSelectedChat }) => {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Chats</h1>
            <input
                type="text"
                placeholder="Search"
                className="w-full p-2 mb-4 rounded-lg bg-gray-800 text-white"
            />
            <ul className="space-y-2">
                {users.length > 0 ? (
                    users.map((user) => (
                        <li
                            key={user.email}
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
                                {sessionStorage.setItem("chatUser", user.email)}
                            </div>
                        </li>

                    ))
                ) : (
                    <div className="text-gray-500">No users available</div>
                )}
            </ul>
        </div>
    );
};


export default Chats;
