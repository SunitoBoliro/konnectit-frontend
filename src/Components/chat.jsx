import React, { useState } from "react";

const Chats = ({ users, setSelectedChat }) => {
  // State to store the search input
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle the search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Chats</h1>
      
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search"
        className="w-full p-2 mb-4 rounded-lg text-white bg-[#5C8374]"
      />
      
      <ul className="space-y-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li
              key={user.email}
              onClick={() => setSelectedChat(user)}
              className="flex items-center p-3 rounded-lg hover:bg-[#9EC8B9] cursor-pointer"
            >
              <img
                src="https://placehold.co/40x40"
                alt={user.username}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="font-semibold">{user.username}</div>
                <div className="text-sm text-white">{user.email}</div>
                {sessionStorage.setItem("chatUser", user.email)}
              </div>
            </li>
          ))
        ) : (
          <div className="text-white">No users available</div>
        )}
      </ul>
    </div>
  );
};

export default Chats;
