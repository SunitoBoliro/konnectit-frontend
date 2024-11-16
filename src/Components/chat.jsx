import React from "react";

const Chats = ({ setSelectedChat }) => {
    const chats = [
        { id: 1, name: "India Sidra", message: "Mashaallah 😘", time: "1:50 pm" },
        { id: 2, name: "Kinza Sana", message: "Masha Allah", time: "3:21 pm" },
        { id: 3, name: "XI-B Pre-Medical KPC", message: "~ Basit: 📢 Join Us for an Orientation Session!", time: "2:36 pm" },
        { id: 4, name: "Sobia", message: "🌼 Ok", time: "2:08 pm" },
        { id: 5, name: "Me Hoooo", message: "🎵 Audio", time: "2:06 pm" },
        { id: 6, name: "Amina", message: "📷 Photo", time: "1:27 pm" },
    ];

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
