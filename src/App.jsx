import { useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AllRoutes from "./Allroutes/index";
import NavBar from "./Components/Navbar";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

    return (
        <Router>
            <div>
                {/* Conditionally render the NavBar */}
                <ConditionalNavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
                <AllRoutes isAuthenticated={isAuthenticated} handleLogin={handleLogin} handleLogout={handleLogout} />
            </div>
        </Router>
    );
}

const ConditionalNavBar = ({ isAuthenticated, handleLogout }) => {
    const location = useLocation();
    const hideNavBar = ["/login", "/register", "/"].includes(location.pathname);

    return !hideNavBar && isAuthenticated ? <NavBar onLogout={handleLogout} /> : null;
};
