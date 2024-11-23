import React, { useState } from "react";
import { MdPersonAddAlt } from "react-icons/md";

const Chats = ({ users, setSelectedChat }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [email, setEmail] = useState(""); // State to capture email input

  // Function to handle the search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle adding a user
  const handleAddUser = () => {
    console.log("User added with email:", email);
    setEmail(""); // Clear the input field
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="relative">
      {/* Fixed Header Section */}
      <div className="fixed top-0 left-18 w-[30.5vw] bg-[#1B4242] z-10 p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Chats</h1>
          {/* Add User Icon */}
          <MdPersonAddAlt
            className="text-2xl text-white cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
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
                </div>
              </li>
            ))
          ) : (
            <div className="text-white">No users available</div>
          )}
        </ul>
      </div>

      {/* Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
    <div className="bg-[#1B4242] p-6 rounded-lg shadow-2xl w-96 transform scale-105 transition-transform duration-300">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">Add New User</h2>
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter user email"
        className="w-full p-3 mb-6 rounded-lg bg-[#5C8374] text-white placeholder-gray-300 outline-none focus:ring focus:ring-[#9EC8B9] transition-all duration-300"
      />
      
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleAddUser}
          className="px-6 py-2 bg-[#5C8374] text-white rounded-lg hover:bg-[#9EC8B9] transition-all duration-300"
        >
          Add
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Chats;
