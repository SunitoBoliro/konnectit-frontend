import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../Pages/Home";
import Registration from "../Pages/Register";
import LoginPage from "../Pages/Login";
import ChatWindow from "../Pages/chatWindow";
import ChatPage from "../Pages/chatPage";
import CallPage  from "../Pages/callPage"
import GroupChat from "../Pages/groupChat.jsx";

const AllRoutes = ({ isAuthenticated, handleLogin, handleLogout }) => {
    return (
        <Routes>
            <Route
                path="/"
                element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <Navigate to="/login" replace />}
            />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/chatwindow" element={<ChatWindow />} />
            <Route path="/chatpage" element={<ChatPage />} />
            <Route path="/GroupChatPage" element={<GroupChat />} />
            <Route path="/callpage" element={<CallPage />} />
        </Routes>
    );
};

export default AllRoutes;
