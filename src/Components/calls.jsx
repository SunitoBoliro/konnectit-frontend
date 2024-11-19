import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CallInfo from "./callinfo.jsx";

const CallsList = ({ setSelectedChat }) => {
  const navigate = useNavigate();

  // Dummy calls data
  const calls = [
    { id: 1, name: "Ahsan Uni", time: "4:43 PM", status: "Outgoing", logs: ["Call started", "Call ended after 1m 18s"] },
    { id: 2, name: "Huzaifa Zong", time: "3:15 PM", status: "Incoming", logs: ["Call started", "No answer"] },
    { id: 3, name: "Ahsan Uni", time: "Yesterday", status: "Outgoing", logs: ["Call started", "Call ended after 2m 30s"] },
  ];

  // State to store the search term
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter calls based on the search term
  const filteredCalls = calls.filter((call) =>
    call.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    call.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#1B4242] text-white h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Calls</h1>
      
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search or start a new call"
        className="p-2 mb-4 w-full bg-[#5C8374] rounded"
      />
      
      {/* Calls List */}
      <ul className="space-y-4">
        {filteredCalls.length > 0 ? (
          filteredCalls.map((call) => (
            <li
              key={call.id}
              className="p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#5C8374]"
              onClick={() => {
                setSelectedChat(call.id); // Set the selected call
                console.log(call.id);
              }}
            >
              <div>
                <h2 className="text-lg font-medium">{call.name}</h2>
                <p className="text-sm text-gray-400">{call.time}</p>
              </div>
              <p className="text-sm">{call.status}</p>
            </li>
          ))
        ) : (
          <div className="text-gray-500">No calls found</div>
        )}
      </ul>
    </div>
  );
};

export default CallsList;
