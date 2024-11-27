import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Components/Api/authService";
import "./loader.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = ({ onLogin }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // State for loader

    const handleLogin = async () => {
        setLoading(true); // Start loader
        try {
            const response = await loginUser({ email, password });
            onLogin(); // Set authenticated state in App
            localStorage.setItem("token", response.token);
            localStorage.setItem("userId", response.userId);

            toast.success("Login successful!", { position: "top-center" });
            setTimeout(() => {
                setLoading(false); // Stop loader
                navigate("/", { replace: true }); // Navigate after success
            }, 2000); // 2-second delay for a better user experience
        } catch (error) {
            setLoading(false); // Stop loader
            if (error instanceof Error) {
                console.error(error.message);
                toast.error(error.message, { position: "top-center" });
            } else {
                toast.error("An unexpected error occurred", { position: "top-center" });
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#1B4242] via-[#5C8374] to-[#9EC8B9] text-white">
            <div className="bg-gray-900 p-10 rounded-lg shadow-2xl w-full max-w-md border border-indigo-500 neon-glow">
                <ToastContainer />
                <h2 className="text-4xl font-bold mb-6 text-center text-teal-400">Login</h2>

                <div className="mb-4">
                    <label className="block text-teal-300 text-sm font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-indigo-500 rounded focus:outline-none focus:border-purple-400 text-white"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-teal-300 text-sm font-semibold mb-2">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-indigo-500 rounded focus:outline-none focus:border-purple-400 text-white"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading} // Disable button when loading
                    className={`w-full font-bold py-2 px-4 rounded-lg transition transform ${
                        loading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-teal-600 text-white hover:bg-green-600 hover:scale-105 neon-button"
                    }`}
                >
                    {loading ? (
                        <span className="loader"></span> // Show loader if loading
                    ) : (
                        "Login"
                    )}
                </button>

                <div className="text-center mt-4">
                    <p className="text-indigo-300">Don't have an account?</p>
                    <button
                        onClick={() => navigate("/register")}
                        className="text-green-400 font-semibold hover:underline"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
