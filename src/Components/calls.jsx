import React from "react";
import { useNavigate } from "react-router-dom";

const CallsList = () => {
    const navigate = useNavigate();

    const calls = [
        { id: 1, name: "Ahsan Uni", time: "4:43 PM", status: "Outgoing" },
        { id: 2, name: "Huzaifa Zong", time: "3:15 PM", status: "Incoming" },
        { id: 3, name: "Ahsan Uni", time: "Yesterday", status: "Outgoing" },
    ];

    return (
        <div className="bg-gray-900 text-white h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Calls</h1>
            <input
                type="text"
                placeholder="Search or start a new call"
                className="p-2 mb-4 w-full bg-gray-800 rounded"
            />
            <ul className="space-y-4">
                {calls.map((call) => (
                    <li
                        key={call.id}
                        className="p-4 bg-gray-800 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-700"
                        onClick={() => navigate(`/call-info/${call.id}`)} // Navigate to Call Info
                    >
                        <div>
                            <h2 className="text-lg font-medium">{call.name}</h2>
                            <p className="text-sm text-gray-400">{call.time}</p>
                        </div>
                        <p className="text-sm">{call.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CallsList;
