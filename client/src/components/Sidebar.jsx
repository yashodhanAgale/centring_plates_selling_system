import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logout from "./Logout";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();
  const userRole = user?.role || "user";
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="h-full bg-gradient-to-b from-blue-700 to-indigo-900 text-white">
      {/* Hamburger Menu for Small Screens */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
        <button
          onClick={toggleSidebar}
          className="text-2xl focus:outline-none hover:text-gray-300"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar Links */}
      <nav
        className={`${
          isOpen ? "block" : "hidden"
        } md:block md:w-64 w-full bg-gradient-to-b from-blue-700 to-indigo-900 md:relative md:h-screen h-auto top-0 left-0 z-50`}
      >
        <ul className="space-y-4 py-8 md:py-12 px-6 md:px-4 text-lg md:text-base">
          <li>
            <Link
              to={`/${userRole}-dashboard`}
              className="block py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/my-activity"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              My Activity
            </Link>
          </li>
          <li>
            <Link
              to="/user-account"
              className="block py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              My Account
            </Link>
          </li>
          <li>
            <Logout />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
