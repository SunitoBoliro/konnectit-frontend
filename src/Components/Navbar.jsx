import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMessage, AiOutlinePhone, AiOutlineLogout } from 'react-icons/ai';
import { RiGroupLine } from "react-icons/ri";
import UserModal from '../Components/userImagenavmodal'; // Import UserModal component
import { fetchOwnInfo, changeProfilePicture } from './Api/chatServies';
import { getToken } from './Api/authService';
import defaultImage from "../assets/defaultImage"

const NavBar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [dataUser, setDataUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem('own_pp')); // State to manage avatar image

  // Fetch user data from API
  const fetchOwnInfoX = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in local storage');
      const data = await fetchOwnInfo(token);

      if (data && data[0]?.pp) {
        setAvatarUrl(data[0].pp); // Update avatar URL from API
        localStorage.setItem('own_pp', data[0].pp); // Save to localStorage
      }
      setDataUser(data[0]);
    } catch (error) {
      console.error('Error fetching user info:', error.message);
    }
  };

  useEffect(() => {
    fetchOwnInfoX();
  }, []);

  // Update profile picture
  const updateCurrentLoggedInUserProfilePicture = async (pp, email, token) => {
    try {
      await changeProfilePicture(pp, email, token);
      fetchOwnInfoX(); // Refresh user info after updating profile picture
    } catch (error) {
      console.error('Error updating profile picture:', error.message);
    }
  };

  // Handle image change
  const handleImageChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setAvatarUrl(base64Image); // Update the avatar URL in the parent component

      // Call API to update profile picture
      await updateCurrentLoggedInUserProfilePicture(
        base64Image,
        localStorage.getItem('currentLoggedInUser'),
        getToken()
      );
      localStorage.setItem('own_pp', base64Image); // Save updated image in localStorage
    };
    reader.readAsDataURL(file); // Convert image to Base64 for preview
  };

  // Handle alternative image change
  const handleImageChangeX = async (file) => {
    
        setAvatarUrl(defaultImage); // Update avatar in UI

        // Update profile picture via API
        const response = await updateCurrentLoggedInUserProfilePicture(
          defaultImage,
          localStorage.getItem('currentLoggedInUser'),
          getToken()
        );

        if (response?.success) {
          console.log('Profile picture updated successfully.');
          localStorage.setItem('own_pp', defaultImage); // Save updated image in localStorage
        } else {
          console.error('Failed to update profile picture:', response?.message || 'Unknown error');
        }
       // Convert image to Base64
    };

  // Toggle Modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="fixed top-0 left-0 border-r border-gray-700 h-full w-20 text-white shadow-lg z-50 flex flex-col">
      {/* Sidebar Navigation */}
      <nav className="flex-grow p-7">
        <ul className="space-y-7">
          <li>
            <button
              onClick={() => navigate('/chatpage')}
              className="flex items-center space-x-3 hover:text-amber-300 transition"
            >
              <AiOutlineMessage size={24} />
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/GroupChatPage')}
              className="flex items-center space-x-3 hover:text-amber-300 transition"
            >
              <RiGroupLine size={24} />
            </button>
          </li>
          <li>
            <button
              onClick={onLogout}
              className="flex items-center space-x-3 text-red-400 hover:text-red-600 transition"
            >
              <AiOutlineLogout size={24} />
            </button>
          </li>
        </ul>
      </nav>

      {/* Profile Image */}
      <div className="flex items-center justify-center mb-4">
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-12 h-12 object-cover rounded-full cursor-pointer"
          onClick={toggleModal} // Toggle modal on click
        />
      </div>

      {/* Profile Modal */}
      {isModalOpen && (
        <UserModal
          onClose={toggleModal} // Close modal
          dataUser={dataUser}
          onImageChange={handleImageChange} // Handle image change
          onImageChangeX={handleImageChangeX} // Alternative image change
        />
      )}
    </div>
  );
};

export default NavBar;
