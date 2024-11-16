// HomePage.js
import { useNavigate } from "react-router-dom";
import "./home.css";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
            <div className="text-center p-10 rounded-lg shadow-lg max-w-lg mx-auto neon-glow border-2 border-teal-500">
                <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                    Welcome to Konnectit!
                </h1>
                <p className="text-lg mb-6 text-gray-300">
                    Connect, chat, and share with friends in a secure, stylish space.
                </p>
                <button
                    onClick={() => navigate("/chatpage")}
                    className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full shadow-md transition-transform transform hover:scale-105 neon-button"
                >
                    Start Chatting
                </button>
            </div>
        </div>
    );
};

export default HomePage;
