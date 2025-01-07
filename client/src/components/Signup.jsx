// import { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const navigate = useNavigate();

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     try {
//       const response = await axios.post(
//         "http://localhost:5001/auth/signup",
//         formData
//       );
//       setMessage(response.data.msg);
//       setFormData({ name: "", email: "", password: "" });
//       navigate("/");
//     } catch (err) {
//       if (err.response && err.response.data.msg) {
//         setError(err.response.data.msg);
//       } else {
//         setError("Something went wrong. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           Sign Up
//         </h2>
//         {error && (
//           <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
//             {error}
//           </div>
//         )}
//         {message && (
//           <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
//             {message}
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label
//               htmlFor="name"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Full Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter your full name"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label
//               htmlFor="email"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label
//               htmlFor="password"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter a 4-6 digit password"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
//           >
//             Sign Up
//           </button>
//         </form>
//         <p className="text-center text-gray-600 mt-4">
//           Already have an account?{" "}
//           <Link to="/" className="text-blue-500 hover:underline">
//             Click here to login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleSendOtp = async () => {
  //   setOtpMessage("");
  //   setOtpError("");
  //   try {
  //     await axios.post("http://localhost:5001/otp/email-otp", {
  //       email: formData.email,
  //     });
  //     setOtpMessage("OTP sent to your email. Please check your inbox.");
  //     setOtpModal(true);
  //   } catch (err) {
  //     setOtpError(
  //       err.response?.data?.message || "Failed to send OTP. Please try again."
  //     );
  //   }
  // };

  const handleSendOtp = async () => {
    setOtpMessage("");
    setOtpError("");
    try {
      setOtpModal(false); // Ensure modal doesn't open prematurely
      setOtpMessage("Sending OTP...");
      await axios.post(`${apiUrl}/otp/email-otp`, {
        email: formData.email,
      });
      setOtpMessage("OTP sent to your email. Please check your inbox.");
      setOtpModal(true);
    } catch (err) {
      setOtpError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  };

  const handleVerifyOtp = async () => {
    setOtpMessage("");
    setOtpError("");
    try {
      const response = await axios.post(`${apiUrl}/otp/verify-email`, {
        email: formData.email,
        enteredOtp: otp,
      });
      setOtpMessage(response.data.message || "Email verified successfully.");
      setIsEmailVerified(true);
      setOtpModal(false);
    } catch (err) {
      setOtpError(
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      setError("Email verification is required.");
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${apiUrl}/auth/signup`, formData);
      setMessage(response.data.msg);
      setFormData({ name: "", email: "", password: "" });
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.msg || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          {/* <button
            type="button"
            onClick={handleSendOtp}
            className={`w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 mb-4 ${
              isEmailVerified ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isEmailVerified}
          >
            {isEmailVerified ? "Email Verified" : "Verify Email"}
          </button> */}
          <button
            type="button"
            onClick={handleSendOtp}
            className={`w-full text-white p-3 rounded-lg focus:outline-none focus:ring focus:ring-gray-300 mb-4 ${
              isEmailVerified
                ? "bg-green-500 cursor-not-allowed"
                : otpMessage
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isEmailVerified || otpMessage.includes("Sending")}
          >
            {isEmailVerified
              ? "Email Verified"
              : otpMessage.includes("Sending")
              ? "Sending OTP..."
              : otpMessage.includes("OTP sent")
              ? "OTP Sent, Check Email"
              : "Verify Email"}
          </button>

          {otpError && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
              {otpError}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a 4-6 digit password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Click here to login
          </Link>
        </p>
      </div>

      {/* OTP Modal */}
      {otpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Enter OTP</h3>
            {otpError && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                {otpError}
              </div>
            )}
            {otpMessage && (
              <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
                {otpMessage}
              </div>
            )}
            <input
              type="text"
              maxLength="4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 4-digit OTP"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setOtpModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mr-2"
              >
                Close
              </button>
              <button
                onClick={handleVerifyOtp}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
