import { useState } from "react";
import axios from "axios";
import ConstantHeader from "../components/ConstantHeader";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const UserAccount = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { user } = useAuth();
  const [fieldToEdit, setFieldToEdit] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdate = async () => {
    if (!inputValue.trim()) {
      setMessage("Field cannot be empty.");
      setIsSuccess(false);
      return;
    }

    const payload = { userId: user?.id };
    console.log("This is payload: ", payload);

    if (fieldToEdit === "name") {
      payload.name = inputValue;
    } else if (fieldToEdit === "email") {
      payload.email = inputValue;
    } else if (fieldToEdit === "password") {
      if (!currentPassword.trim()) {
        setMessage("Current password is required.");
        setIsSuccess(false);
        return;
      }
      payload.password = inputValue;
      payload.currentPassword = currentPassword;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/auth/update-profile`,
        payload
      );
      setMessage(response.data.message || "Profile updated successfully.");
      setIsSuccess(true);
      setFieldToEdit(null);
      setInputValue("");
      setCurrentPassword("");

      // Hide the success message after 5 seconds
      setTimeout(() => {
        setMessage("");
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="bg-white shadow-lg rounded-xl w-full max-w-lg p-6 mx-4 md:mx-0">
            <h1 className="text-3xl font-bold text-blue-600 text-center mb-4">
              Manage Your Account
            </h1>

            <div className="space-y-4">
              {["name", "email", "password"].map((field) => (
                <button
                  key={field}
                  onClick={() => {
                    setFieldToEdit(field);
                    setMessage("");
                    setIsSuccess(false);
                  }}
                  className="w-full px-6 py-3 text-lg font-medium bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                >
                  Update {field.charAt(0).toUpperCase() + field.slice(1)}
                </button>
              ))}
            </div>

            {fieldToEdit && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {fieldToEdit === "password"
                    ? "Enter New Password"
                    : `Update ${
                        fieldToEdit.charAt(0).toUpperCase() +
                        fieldToEdit.slice(1)
                      }`}
                </label>
                <input
                  type={fieldToEdit === "password" ? "password" : "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={`Enter ${fieldToEdit}`}
                />
                {fieldToEdit === "password" && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Enter Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter current password"
                    />
                  </div>
                )}
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Submit"}
                  </button>
                  <button
                    onClick={() => setFieldToEdit(null)}
                    className="flex-1 px-4 py-2 text-blue-600 bg-white border border-blue-500 rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div
                className={`mt-6 p-4 rounded-lg ${
                  isSuccess
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
