import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout, AiOutlineMessage, AiOutlinePhone, AiOutlineMenu } from "react-icons/ai";

const NavBar = ({ onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    // Close the menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full bg-gray-900 text-white z-50">
            {/* Hamburger Icon */}
            <div className="flex items-center p-4">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-2xl hover:text-amber-300 transition focus:outline-none"
                >
                    <AiOutlineMenu />
                </button>
            </div>

            {/* Sidebar Menu */}
            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="w-64 h-screen bg-gray-800 text-white p-6 shadow-lg fixed top-0 left-0 flex flex-col"
                >
                    <nav>
                        <ul className="space-y-6">
                            <li>
                                <button
                                    onClick={() => navigate("/chatwindow")}
                                    className="flex items-center space-x-3 hover:text-amber-300 transition"
                                >
                                    <AiOutlineMessage size={24} />
                                    <span>Chats</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/call")}
                                    className="flex items-center space-x-3 hover:text-amber-300 transition"
                                >
                                    <AiOutlinePhone size={24} />
                                    <span>Calls</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={onLogout}
                                    className="flex items-center space-x-3 text-red-400 hover:text-red-600 transition"
                                >
                                    <AiOutlineLogout size={24} />
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default NavBar;
