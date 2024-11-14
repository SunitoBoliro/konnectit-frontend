import { useState } from "react";
import AllRoutes from "./Allroutes/index"; // Adjust the path if necessary

export default function App() {
  // State to manage user authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to update the authentication status
  const handleLogin = () => setIsAuthenticated(true);

  return (
    <div className="text-3xl font-bold underline">
      {/* Pass authentication status and login function as props */}
      <AllRoutes isAuthenticated={isAuthenticated} handleLogin={handleLogin} />
    </div>
  );
}
