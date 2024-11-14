import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../Pages/Home";
import Registration from "../Pages/Register";
import LoginPage from "../Pages/Login";

const AllRoutes = ({ isAuthenticated, handleLogin }) => {
    return (
        <Router>
            <Routes>
                {/* Protect Home route - redirect to login if not authenticated */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />
                    }
                />
                {/* Login and Register routes */}
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/register" element={<Registration onRegister={handleLogin} />} />
            </Routes>
        </Router>
    );
};

export default AllRoutes;
