import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AllRoutes from "./Allroutes/index";
import NavBar from "./Components/Navbar";
import { validateToken, getToken } from "./Components/Api/authService";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Check authentication state on initial load
    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            if (token) {
                // If token exists, validate it
                const valid = await validateToken(token);
                console.log(valid); // Check the token validation response
                if (valid) {
                    setIsAuthenticated(true); // Token is valid, user is authenticated
                    navigate("/", { replace: true }); // Redirect to the homepage
                } else {
                    localStorage.removeItem("token"); // Clear invalid token
                    setIsAuthenticated(false);
                    navigate("/login", { replace: true }); // Redirect to login page
                }
            } else {
                setIsAuthenticated(false); // No token found
                navigate("/login", { replace: true }); // Redirect to login page
            }
        };

        // Only call checkAuth if the user is not already authenticated
        if (!isAuthenticated) {
            checkAuth();
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = () => {
        setIsAuthenticated(true); // Set authenticated to true on login
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("token"); // Remove token on logout
        navigate("/login", { replace: true }); // Redirect to login page
    };

    return (
        <div>
            {/* Conditionally render the NavBar */}
            <ConditionalNavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
            <AllRoutes isAuthenticated={isAuthenticated} handleLogin={handleLogin} handleLogout={handleLogout} />
        </div>
    );
}

const ConditionalNavBar = ({ isAuthenticated, handleLogout }) => {
    const location = useLocation();
    const hideNavBar = ["/","/login", "/register"].includes(location.pathname);

    return !hideNavBar && isAuthenticated ? <NavBar onLogout={handleLogout} /> : null;
};
