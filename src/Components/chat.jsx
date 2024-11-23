import React, { useState } from "react";
import { MdPersonAddAlt } from "react-icons/md";


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
    <div className="relative">
  {/* Fixed Header Section */}
  <div className="fixed top-0 left-18 w-[30.5vw] bg-[#1B4242] z-10 p-2 shadow-md">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-white">Chats</h1>
      <MdPersonAddAlt className="text-2xl text-white cursor-pointer" />
    </div>

    {/* Search Input */}
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearch}
      placeholder="Search"
      className="w-full mt-4 p-2 rounded-lg text-white bg-[#5C8374]"
    />
  </div>

  {/* List of Chats */}
  <div className="mt-24 p-4">
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
</div>

  );
};

export default Chats;
