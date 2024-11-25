import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Components/Api/authService";
import "./home.css";

const Registration = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [image, setImage] = useState(null); // State to hold the Base64 image

    // Handle the image input change (convert to Base64)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Set the Base64 string
            };
            reader.readAsDataURL(file); // Convert image to Base64
        }
    };

    const handleRegister = async () => {
        try {
            const userData = {
                username: name,
                email,
                password,
                pp: image // Include the Base64 string of the profile picture
            };
            await registerUser(userData);
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (error) {
            setError(error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#1B4242] via-[#5C8374] to-[#9EC8B9] text-white">
            <div className="bg-[#092635] p-10 rounded-lg shadow-2xl w-full max-w-md border border-teal-500 neon-glow">
                <h2 className="text-4xl font-bold mb-6 text-center text-teal-400">Register</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-teal-300 text-sm font-semibold mb-2">Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-teal-500 rounded focus:outline-none focus:border-green-400 text-white"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-teal-300 text-sm font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-teal-500 rounded focus:outline-none focus:border-green-400 text-white"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-teal-300 text-sm font-semibold mb-2">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-teal-500 rounded focus:outline-none focus:border-green-400 text-white"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-teal-300 text-sm font-semibold mb-2">Profile Picture</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full p-3 bg-gray-800 border border-teal-500 rounded focus:outline-none text-white"
                    />
                </div>

                <button onClick={handleRegister} className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition transform hover:scale-105 neon-button">
                    Register
                </button>

                <div className="text-center mt-4">
                    <button onClick={() => navigate("/login")} className="text-green-400 font-semibold hover:underline">
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Registration;
