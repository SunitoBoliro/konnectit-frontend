// import { useNavigate } from "react-router-dom";

// const Navbar = ({ onLogout }) => {
//     const navigate = useNavigate();

//     return (
//         <div className="fixed top-0 left-0 h-full w-16 bg-gray-800 text-white flex flex-col items-center py-4 z-50">
//             {/* Navigation Links */}
//             <button 
//                 onClick={() => navigate("/page")} 
//                 className="my-4 p-2 hover:bg-gray-700 rounded-full transition"
//                 title="Page"
//             >
//                 Page
//             </button>
//             <button 
//                 onClick={() => navigate("/chats")} 
//                 className="my-4 p-2 hover:bg-gray-700 rounded-full transition"
//                 title="Chats"
//             >
//                 Chats
//             </button>
//             <button 
//                 onClick={() => navigate("/calls")} 
//                 className="my-4 p-2 hover:bg-gray-700 rounded-full transition"
//                 title="Calls"
//             >
//                 Calls
//             </button>

//             {/* Logout Button */}
//             <button 
//                 onClick={onLogout} 
//                 className="mt-auto mb-4 p-2 hover:bg-red-700 bg-red-600 text-white rounded-full transition"
//                 title="Logout"
//             >
//                 Logout
//             </button>
//         </div>
//     );
// };

// export default Navbar;



import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Logout logic
        alert("Logged out");
        navigate("/login");
    };

    return (
        <div className="w-1/4 bg-gray-800 text-white flex flex-col items-center p-4 space-y-4">
            <h2 className="text-lg font-semibold">Chats</h2>
            
            <div className="flex-1 w-full space-y-2">
                <button className="w-full p-2 bg-gray-700 rounded">User 1</button>
                <button className="w-full p-2 bg-gray-700 rounded">User 2</button>
                <button className="w-full p-2 bg-gray-700 rounded">User 3</button>
            </div>
            
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
}
