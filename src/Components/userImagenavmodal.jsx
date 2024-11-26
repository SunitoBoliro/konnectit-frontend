import React, { useState } from 'react';

const UserModal = ({ onClose, dataUser, onImageChange }) => {
  const [image, setImage] = useState(dataUser.pp); // State for image preview
  const [isFullScreen, setIsFullScreen] = useState(false); // State for full-screen view

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the image preview
        if (onImageChange) {
          onImageChange(file); // Call onImageChange if it's a valid function
        }
      };
      reader.readAsDataURL(file); // Convert image to base64 for preview
    }
  };

  // Toggle full-screen view
  const handleImageClick = () => {
    setIsFullScreen(true); // Set full-screen state to true
  };

  const handleBackClick = () => {
    setIsFullScreen(false); // Set full-screen state to false (close full-screen)
  };

  return (
    <>
      {/* Full Screen Image Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative bg-white p-4 rounded-md">
            {/* Close Button */}
            <button
              onClick={handleBackClick} // Close full screen
              className="absolute top-4 left-4 text-white text-lg font-semibold"
            >
              Back
            </button>

            {/* Full Screen Image */}
            <img
              src={image}
              alt="Full Screen Avatar"
              className="max-w-full max-h-full object-contain bg-white shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 bg-gray-700 bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg transform transition-all animate-modal-in">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 font-semibold focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">User Information</h2>

          <div className="flex justify-center mb-6">
            <img
              src={image}
              alt="User Avatar"
              className="w-24 h-24 object-cover rounded-full border-4 border-gray-300 shadow-md cursor-pointer"
              onClick={handleImageClick} // Open in full screen
            />
          </div>

          <div className="flex justify-center mb-6">
            <label className="cursor-pointer text-blue-500 hover:text-blue-700">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange} // Handle file selection
                className="hidden"
              />
              <span className="text-sm font-medium">Change Profile Picture</span>
            </label>
          </div>

          <div className="text-center">
            <p className="text-xl font-medium text-gray-800 mb-2">{dataUser.username}</p>
            <p className="text-sm text-gray-500">{dataUser.email}</p>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
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
