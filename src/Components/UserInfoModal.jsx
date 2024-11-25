import React, { useState } from "react";
import { FaUserAlt, FaEnvelope, FaTrashAlt, FaUpload, FaSave } from "react-icons/fa";

const UserModal = ({ isOpen, onClose, user, onUpdateAvatar }) => {
  const [newImage, setNewImage] = useState(null);
  const [isImageOpen, setIsImageOpen] = useState(false); // State to toggle image modal

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (newImage) {
      onUpdateAvatar(newImage); // Update avatar in the parent component
      onClose(); // Close the modal
    }
  };

  const handleImageClick = () => {
    setIsImageOpen(true);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "overlay") {
      setIsImageOpen(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div
        id="overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleOutsideClick}
      >
        <div
          className="bg-primary rounded-lg shadow-lg w-[500px] p-6"
          onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-2">
            <FaUserAlt className="text-white" />
            <span>User Details</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column: Email and Remove User */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-white" />
                <p className="text-white">{user.email}</p>
              </div>
              <button
                className="flex items-center justify-center w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={onClose}
              >
                <FaTrashAlt className="mr-2" />
                Remove User
              </button>
            </div>

            {/* Right Column: Avatar and Upload */}
            <div className="space-y-4 text-center">
              <img
                src={newImage || user.avatar}
                alt="User Avatar"
                className="w-20 h-20 rounded-full object-cover border border-gray-300 mx-auto cursor-pointer"
                onClick={handleImageClick} // Open full-screen modal
              />
              <label
                htmlFor="upload-image"
                className="flex items-center justify-center w-full bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 transition"
              >
                <FaUpload className="mr-2" />
                Upload Image
                <input
                  type="file"
                  id="upload-image"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <button
                className="flex items-center justify-center w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
                onClick={handleSave}
              >
                <FaSave className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Full-Screen Modal */}
      {isImageOpen && (
        <div
          id="overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleOutsideClick}
        >
          <img
            src={newImage || user.avatar}
            alt="Full Screen Avatar"
            className="max-w-full max-h-full rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking on image
          />
        </div>
      )}
    </>
  );
};

export default UserModal;
