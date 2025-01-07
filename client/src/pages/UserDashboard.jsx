import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaPhoneAlt } from "react-icons/fa";
import { useState } from "react";
import ConstantHeader from "../components/ConstantHeader";
import Sidebar from "../components/Sidebar";

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showOwners, setShowOwners] = useState(false);

  const handleRequestClick = () => {
    navigate("/create-request");
  };

  const toggleOwnersInfo = () => {
    setShowOwners((prev) => !prev);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50">
          <ConstantHeader />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="sticky top-16 h-full w-64 bg-gray-800 text-white overflow-y-hidden">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-purple-600 to-indigo-800 text-white px-6 py-12">
            <div className="flex flex-col items-center justify-center">
              {/* Greeting Section */}
              <div className="text-center mb-10">
                <h1 className="text-5xl font-extrabold mb-4">
                  Welcome, {user?.name}!
                </h1>
                <p className="text-lg">
                  Thank you for choosing us. Let's make your experience amazing!
                </p>
              </div>

              {/* Business Information */}
              <div className="bg-white text-gray-900 rounded-xl shadow-lg p-8 max-w-4xl w-full mb-8">
                <h2 className="text-3xl font-semibold mb-6 text-center">
                  Why Choose Us?
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-600 mr-3 text-2xl" />
                    <span>
                      Premium-quality centring plates at the best prices.
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-600 mr-3 text-2xl" />
                    <span>100% trusted and reliable service.</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-600 mr-3 text-2xl" />
                    <span>Simple and transparent ordering process.</span>
                  </li>
                </ul>
                <p className="text-lg mt-6 leading-relaxed text-center">
                  Place your order by specifying the quantity and providing your
                  accurate address. We'll verify the details and contact you to
                  complete the process.
                </p>
              </div>

              {/* Action Section */}
              <div className="text-center mb-8">
                <button
                  onClick={handleRequestClick}
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xl font-semibold shadow-lg transition-transform transform hover:scale-105"
                >
                  Request Centring Plates
                </button>
              </div>

              {/* Owners Section */}
              <div className="text-center">
                <button
                  onClick={toggleOwnersInfo}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xl font-semibold shadow-lg transition-transform transform hover:scale-105"
                >
                  Know About Owners
                </button>
                {showOwners && (
                  <div className="mt-8 bg-white text-gray-900 rounded-xl shadow-lg p-8 max-w-4xl w-full">
                    <h2 className="text-3xl font-semibold mb-6 text-center">
                      Meet Our Owners
                    </h2>
                    <div className="space-y-8">
                      {/* Owner 1 */}
                      <div className="border-b pb-4">
                        <h3 className="text-2xl font-bold">
                          Omkar Balkrushna Karale
                        </h3>
                        <p className="text-lg">
                          Prince Shivaji Nagar, Kasaba Bawada, Kolhapur
                        </p>
                        <p className="text-lg flex items-center">
                          <FaPhoneAlt className="mr-2 text-indigo-500" />
                          9168513616
                        </p>
                      </div>
                      {/* Owner 2 */}
                      <div>
                        <h3 className="text-2xl font-bold">
                          Sanket Anil Redekar
                        </h3>
                        <p className="text-lg">
                          Redekar Mala, Kasaba Bawada, Kolhapur
                        </p>
                        <p className="text-lg flex items-center">
                          <FaPhoneAlt className="mr-2 text-indigo-500" />
                          9325343667
                        </p>
                      </div>
                    </div>
                    <p className="mt-6 text-lg text-center">
                      For more inquiries, feel free to call us directly!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
