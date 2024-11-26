import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMessage, AiOutlinePhone, AiOutlineLogout } from 'react-icons/ai';
import UserModal from '../Components/userImagenavmodal'; // Import UserModal component
import { fetchOwnInfo } from './Api/chatServies';

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
      }
      setDataUser(data[0]);

    } catch (error) {
      console.error('Error fetching user info:', error.message);
    }
  };

  useEffect(() => {
    fetchOwnInfoX();
  }, []);

  // Toggle Modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle image change in the parent component
  const handleImageChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result); // Update the avatar URL in the parent component
      localStorage.setItem('own_pp', reader.result); // Save updated image in localStorage
    };
    reader.readAsDataURL(file); // Convert image to base64 for preview
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
              onClick={() => navigate('/callpage')}
              className="flex items-center space-x-3 hover:text-amber-300 transition"
            >
              <AiOutlinePhone size={24} />
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
          onClose={toggleModal} // Close modal on close
          dataUser={dataUser}
          onImageChange={handleImageChange} // Handle image change in parent component
        />
      )}
    </div>
  );
};

export default NavBar;
