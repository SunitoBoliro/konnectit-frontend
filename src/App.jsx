import { useState } from "react";
import AllRoutes from "./Allroutes/index";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

    return (
        <div className="text-3xl font-bold underline">
            <AllRoutes isAuthenticated={isAuthenticated} handleLogin={handleLogin} handleLogout={handleLogout} />
        </div>
    );
}

// import { useState } from "react";
// import AllRoutes from "./Allroutes/index";
// import Sidebar from './Components/Navbar';
// import ChatWindow from './Pages/';

// export default function App() {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     const handleLogin = () => setIsAuthenticated(true);
//     const handleLogout = () => setIsAuthenticated(false);

//     return (
//         <div className="h-screen flex">
//             {/* Sidebar with chat list and logout functionality */}
//             <Sidebar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
            
//             {/* Main chat window */}
//             <ChatWindow />
            
//             {/* Routes for login and other pages */}
//             <div className="text-3xl font-bold underline">
//                 <AllRoutes isAuthenticated={isAuthenticated} handleLogin={handleLogin} handleLogout={handleLogout} />
//             </div>
//         </div>
//     );
// }
