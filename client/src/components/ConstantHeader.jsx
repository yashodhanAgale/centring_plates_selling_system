import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const ConstantHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="w-full h-24 bg-gradient-to-r from-blue-700 to-indigo-900 text-white flex items-center justify-between px-6 py-4 shadow-md">
      {/* Logo/Brand Name */}
      <div className="text-xl md:text-2xl font-bold">
        Vyankateshwara Construction
      </div>

      {/* User's Name and Profile Icon */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* User's Name */}
        <div className="text-lg font-medium flex items-center space-x-2 text-white">
          <span
            className="hidden md:block text-xl cursor-pointer"
            onClick={() => navigate("/user-account")}
          >
            {user?.name}
          </span>
          <FaUserCircle
            className="text-3xl md:text-4xl cursor-pointer"
            onClick={() => navigate("/user-account")}
          />
        </div>
      </div>
    </header>
  );
};

export default ConstantHeader;
