import React, { useState } from 'react';
import defaultImage from "../assets/defaultImage"

const UserModal = ({ onClose, dataUser, onImageChange, onImageChangeX }) => {
  const [image, setImage] = useState(dataUser.pp || pp); // Default or provided image
  const [isFullScreen, setIsFullScreen] = useState(false);


  // Handle image removal
  const handleImageChangeX = () => {
    setImage(defaultImage); // Set to default placeholder
    if (onImageChangeX) {
      onImageChangeX(defaultImage); // Notify parent component
    }
  };

  // Handle new image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        if (onImageChange) {
          onImageChange(file); // Notify parent component
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle full-screen view
  const handleImageClick = () => {
    setIsFullScreen(true);
  };

  const handleBackClick = () => {
    setIsFullScreen(false);
  };

  return (
    <>
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative">
            <button
              onClick={handleBackClick}
              className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded-full"
            >
              Back
            </button>
            <img
              src={image}
              alt="Full Screen Avatar"
              className="max-w-screen-md max-h-screen object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-40 bg-gray-700 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-2xl">
          <div className="flex justify-end">
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="text-xl font-semibold text-center mb-4">User Information</h2>
          <div className="flex justify-center mb-4">
            <img
              src={image}
              alt="User Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 cursor-pointer"
              onClick={handleImageClick}
            />
          </div>
          <div className="flex flex-col items-center gap-2 mb-6">
            <label className="cursor-pointer text-blue-500 hover:text-blue-700">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              Change Profile Picture
            </label>
            <button
              onClick={handleImageChangeX}
              className="text-red-500 hover:text-red-700"
            >
              Remove Profile Picture
            </button>
          </div>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">{dataUser?.username}</p>
            <p className="text-sm text-gray-500">{dataUser?.email}</p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserModal;
