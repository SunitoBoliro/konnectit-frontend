import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../Pages/Home";
import Registration from "../Pages/Register";
import LoginPage from "../Pages/Login";
import ChatWindow from '../Pages/chatWindow'

const AllRoutes = ({ isAuthenticated, handleLogin, handleLogout }) => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <Navigate to="/login" replace />}
                />
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/chatwindow" element={<ChatWindow />} />
            </Routes>
        </Router>
    );
};

export default AllRoutes;
