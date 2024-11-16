import { useNavigate } from "react-router-dom";
import { AiOutlineLogout, AiOutlineMessage, AiOutlinePhone } from "react-icons/ai";

const NavBar = ({ onLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed top-0 left-0 border-r border-gray-700 h-full w-20 bg-gray-900 text-white shadow-lg z-50 flex flex-col ">
            {/* Vertical Line */}
            {/*<div className="border-r border-gray-700 h-full"></div> /!* This adds the vertical line *!/*/}

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
                            onClick={() => navigate("/call")}
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
        </div>
    );
};

export default NavBar;
