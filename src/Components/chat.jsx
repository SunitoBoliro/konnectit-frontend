import React, { useState } from "react";
import { MdPersonAddAlt } from "react-icons/md";
import { joinChat } from "./Api/chatServies.js";
import pp from "../assets/img.png"

const Chats = ({ users, setSelectedChat, refreshChats }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState(null)

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("currentLoggedInUser");

    try {
      const response = await joinChat(userId, email, token);
      setDetails(response.detail)
      if (response.detail === "Chat joined successfully") {
        refreshChats(); // Refresh chat list after successful addition
      } else {
        setIsErrorModalOpen(true); // Open error modal
      }
      setEmail("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
      setIsErrorModalOpen(true); // Open error modal in case of exception
    }
  };

  return (
      <div className="relative">
        {/* Fixed Header Section */}
        <div className="fixed top-0 left-18 w-[30.5vw] bg-[#1B4242]  p-4 shadow-md">
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
                          src={localStorage.getItem("pp")}
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

        {/* Add User Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-[#1B4242] p-6 rounded-lg shadow-2xl w-96">
                <h2 className="text-2xl font-semibold text-white mb-6 text-center">Add New User</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter user email"
                    className="w-full p-3 mb-6 rounded-lg bg-[#5C8374] text-white placeholder-gray-300 outline-none focus:ring focus:ring-[#9EC8B9]"
                />
                <div className="flex justify-end space-x-4">
                  <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleAddUser}
                      className="px-6 py-2 bg-[#5C8374] text-white rounded-lg hover:bg-[#9EC8B9]"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Error Modal */}
        {isErrorModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-[#1B4242] p-6 rounded-lg shadow-2xl w-80">
                <h2 className="text-xl font-semibold text-white mb-4 text-center">Error</h2>
                <p className="text-white text-center mb-6">{`${details === "User already in chat" ? "User Already in Chat!" : 'User Not Found!'}`}</p>
                <div className="flex justify-center">
                  <button
                      onClick={() => setIsErrorModalOpen(false)}
                      className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Chats;
