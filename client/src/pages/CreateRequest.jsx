import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ConstantHeader from "../components/ConstantHeader";
import Sidebar from "../components/Sidebar";

const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  maxLength,
  placeholder,
  required,
  rows,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder={placeholder}
        rows={rows || 3}
      />
    ) : (
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder={placeholder}
      />
    )}
  </div>
);

const CreateRequest = () => {
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [quantity, setQuantity] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState("");

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setOtpSending(true);
    setError("");
    try {
      const response = await axios.post(`${apiUrl}/otp/send-otp`, {
        phoneNumber,
      });

      if (response.status === 200) {
        setOtpSent(true);
        setShowOtpModal(true);
        setOtpError("");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      setOtpError("OTP must be 4 digits.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/otp/verify-otp`, {
        phoneNumber,
        enteredOtp: otp,
      });

      if (response.status === 200) {
        setOtpVerified(true);
        setOtpError("");
        setShowOtpModal(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Incorrect OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      setError("Please verify OTP before submitting the request.");
      return;
    }

    if (!quantity || !deliveryDate || !address) {
      setError("Please fill in all the required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        user_id: user.id,
        name: user.name,
        quantity,
        delivery_date: deliveryDate,
        address,
        phone_number: phoneNumber,
      };

      const response = await axios.post(
        `${apiUrl}/request/centring-plates`,
        requestData
      );

      if (response.status === 201) {
        setSuccessMessage("Request sent successfully!");
        setTimeout(() => setSuccessMessage(""), 5000);
        setQuantity("");
        setDeliveryDate("");
        setAddress("");
        setPhoneNumber("");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating request:", error);
      setError("Failed to send request. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col ">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <ConstantHeader />
      </div>

      <div className="flex flex-1 overflow-y-hidden">
        <div className="sticky top-16 h-full w-64 bg-gray-800 text-white overflow-y-hidden ">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white shadow-lg rounded-lg mx-4 lg:mx-auto max-w-full lg:max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Centring Plate Request
          </h1>

          {successMessage && (
            <div className="bg-green-100 text-green-800 border border-green-300 rounded-md p-4 mb-4">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-800 border border-red-300 rounded-md p-4 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              id="phoneNumber"
              label="Phone Number"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={10}
              placeholder="Enter 10-digit phone number"
              required
            />
            <button
              type="button"
              onClick={handleSendOtp}
              className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={otpSending || otpSent}
            >
              {otpSending ? "Sending OTP..." : "Verify Mobile Number"}
            </button>

            {otpSent && !otpVerified && (
              <div className="mt-4">
                <InputField
                  id="otp"
                  label="OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  placeholder="Enter OTP"
                  required
                />
                {otpError && (
                  <div className="text-red-600 text-sm mt-2">{otpError}</div>
                )}
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className={`mt-2 w-full ${
                    otpVerified ? "bg-green-600" : "bg-indigo-600"
                  } hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  disabled={otpVerified}
                >
                  {otpVerified ? "Phone Number Verified" : "Verify OTP"}
                </button>
              </div>
            )}

            {otpVerified && (
              <div className="text-green-600 mt-4">
                Mobile Number Verified ✅
              </div>
            )}

            <InputField
              id="quantity"
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              placeholder="Enter quantity"
            />

            <InputField
              id="deliveryDate"
              label="Delivery Date"
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              required
            />

            <InputField
              id="address"
              label="Address"
              type="textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Enter delivery address"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting || !otpVerified}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>

      {showOtpModal && !otpVerified && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold">OTP Verification</h2>
            <p className="mt-4">
              Please enter the OTP sent to your mobile number to verify.
            </p>
            <div className="mt-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {otpError && <p className="text-red-500">{otpError}</p>}
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-indigo-600 text-white py-2 mt-4 rounded-md"
                disabled={otp.length !== 4}
              >
                Verify OTP
              </button>
            </div>
            <button
              onClick={() => setShowOtpModal(false)}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRequest;
