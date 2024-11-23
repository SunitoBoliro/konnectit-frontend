import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Components/Api/authService";
import "./home.css";

const LoginPage = ({ onLogin }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await loginUser({ email, password });
            onLogin(); // Set authenticated state in App
            localStorage.setItem("token", response.token);
            localStorage.setItem("userId", response.userId);
            // localStorage.setItem("userId", response.userId);
            navigate("/", { replace: true });
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
                setError(error.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 via-blue-600 to-indigo-700 text-white">
            <div className="bg-gray-900 p-10 rounded-lg shadow-2xl w-full max-w-md border border-indigo-500 neon-glow">
                <h2 className="text-4xl font-bold mb-6 text-center text-indigo-400">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-indigo-300 text-sm font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-indigo-500 rounded focus:outline-none focus:border-purple-400 text-white"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-indigo-300 text-sm font-semibold mb-2">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-indigo-500 rounded focus:outline-none focus:border-purple-400 text-white"
                    />
                </div>

                <button onClick={handleLogin} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 transition transform hover:scale-105 neon-button">
                    Login
                </button>

                <div className="text-center mt-4">
                    <p className="text-indigo-300">Don't have an account?</p>
                    <button
    onClick={() => {
        console.log("Navigating to register");
        navigate("/register");
    }}
    className="mt-2 text-purple-400 font-semibold hover:underline"
>
    Create Account
</button>


                </div>
            </div>
        </div>
    );
};

export default LoginPage;