import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import your pages
import HomePage from "../Pages/Home";
import Registration from "../Pages/Register";
import LoginPage from "../Pages/Login";

const AllRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>
    );
};

export default AllRoutes;
