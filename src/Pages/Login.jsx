import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true); // Start loading
        setError(""); // Clear previous errors

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/login`, // Use environment variable for API URL
                { email, password }
            );

            const { token, userId } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            navigate("/chat"); // Navigate to chat on successful login
        } catch (err) {
            console.error("Login error:", err);

            if (err.response?.data?.detail) {
                setError(err.response.data.detail); // Use detailed error message from API
            } else {
                setError("Failed to login. Please try again.");
            }
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4 border-none"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4 border-none"
                />
                <button
                    onClick={handleLogin}
                    disabled={loading} // Disable button when loading
                    className={`p-2 rounded-lg w-full ${
                        loading
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                {error && (
                    <div className="mt-4 text-red-500 text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
