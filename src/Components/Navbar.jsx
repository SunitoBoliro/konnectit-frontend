import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout, AiOutlineMessage, AiOutlinePhone } from "react-icons/ai";
import UserModal from "../Components/UserInfoModal"; // Ensure this modal is designed to show user info

const NavBar = ({ onLogout }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                            onClick={() => navigate("/chatpage")}
                            className="flex items-center space-x-3 hover:text-amber-300 transition"
                        >
                            <AiOutlineMessage size={24} />
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate("/callpage")}
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
                {/* Avatar Button */}
                <li>
                        <button
                            onClick={toggleModal}
                            className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden hover:shadow-lg transition"
                        >
                            <img
                                src="https://via.placeholder.com/150" // Replace with user's avatar URL
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                            />
                        </button>
                        {/* Modal */}
                        {isModalOpen && (
                            <UserModal onClose={toggleModal} /> // Pass `onClose` to close modal
                        )}
                    </li>
                </ul>
                
            </nav>
        </div>
    );
};

export default NavBar;
