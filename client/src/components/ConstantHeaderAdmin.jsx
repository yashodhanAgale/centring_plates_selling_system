import { FaUserCircle } from "react-icons/fa";
import Logout from "./Logout";
import { useAuth } from "../context/AuthContext";

const ConstantHeaderAdmin = () => {
  const { user } = useAuth();
  return (
    <header className="w-full h-24 bg-gradient-to-r from-blue-700 to-indigo-900 text-white flex items-center justify-between px-6 py-4 shadow-md">
      {/* Logo/Brand Name */}
      <div className="text-xl md:text-2xl font-bold">
        Vyankateshwara Construction
      </div>

      {/* User Info and Logout Button */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* User's Name */}
        <div className="text-lg font-medium flex items-center space-x-2">
          <span className="hidden md:block text-xl">{user?.name}</span>
          <FaUserCircle className="text-3xl md:text-4xl" />
        </div>

        {/* Logout Button */}
        <Logout className="ml-2 md:ml-4 text-white text-lg bg-red-500 hover:bg-red-700 px-4 py-2 rounded-full transition-all" />
      </div>
    </header>
  );
};

export default ConstantHeaderAdmin;
