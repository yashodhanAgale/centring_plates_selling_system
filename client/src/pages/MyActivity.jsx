import { useState, useEffect } from "react";
import axios from "axios";
import ConstantHeader from "../components/ConstantHeader";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const MyActivity = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // State for success message
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tab, setTab] = useState("all"); // Default to "All Requests"
  const [editRequest, setEditRequest] = useState(null); // Store the request being edited
  const [editForm, setEditForm] = useState({
    quantity: "",
    delivery_date: "",
    address: "",
  });

  const itemsPerPage = 10; // Number of items per page

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/request/my-activity/${user?.id}`,
        {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        }
      );
      let filteredRequests = response.data.requests;
      if (tab === "completed") {
        filteredRequests = filteredRequests.filter(
          (request) => request.status === "Completed"
        );
      }
      console.log("This is response myActivity", response);

      setRequests(filteredRequests);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to fetch activity data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchRequests();
    }
  }, [user, currentPage, tab]);

  const handleTabChange = (tabName) => {
    setTab(tabName);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openEditModal = (request) => {
    setEditRequest(request);
    setEditForm({
      quantity: request.quantity,
      delivery_date: request.delivery_date,
      address: request.address,
    });
  };

  const closeEditModal = () => {
    setEditRequest(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEditForm = async () => {
    if (!editRequest) return; // Ensure an edit request exists
    try {
      // Call the API with the request ID in the URL
      await axios.put(
        `${apiUrl}/request/update-request/${editRequest.id}`, // Use the correct endpoint
        {
          ...editForm, // Send the updated form data
          user_id: user?.id, // Include user ID if necessary
        }
      );
      setSuccessMessage("Request updated successfully!"); // Set success message
      closeEditModal(); // Close the modal after successful update
      fetchRequests(); // Refresh the request list

      // Automatically clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error("Error updating request:", err); // Log the error
      alert("Failed to update the request."); // Show an error message to the user
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <ConstantHeader />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block sticky h-full w-64 bg-gray-800 text-white overflow-y-auto">
          <Sidebar />
        </div>
        <div className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          {successMessage && (
            <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-lg font-medium px-4 py-2 rounded-md shadow-lg z-50">
              {successMessage}
            </div>
          )}
          <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-blue-600 text-center mb-4">
              My Activity
            </h1>
            <div className="flex flex-wrap justify-center space-x-4 mb-6">
              <button
                onClick={() => handleTabChange("all")}
                className={`px-4 py-2 rounded-md text-lg font-medium ${
                  tab === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-blue-600"
                }`}
              >
                All Requests
              </button>
              <button
                onClick={() => handleTabChange("completed")}
                className={`px-4 py-2 rounded-md text-lg font-medium ${
                  tab === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-blue-600"
                }`}
              >
                Completed Requests
              </button>
            </div>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {requests.length > 0 ? (
              <div className="space-y-6">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 bg-gray-50 border rounded-lg"
                  >
                    <h2>Request #{request.id}</h2>
                    <p>Quantity: {request.quantity}</p>
                    <p>Delivery Date: {formatDate(request.delivery_date)}</p>
                    <p>Address: {request.address}</p>
                    <p>Status: {request.status}</p>
                    {request.status !== "Completed" && (
                      <button
                        onClick={() => openEditModal(request)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                      >
                        Edit Request
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div>No requests found.</div>
            )}
          </div>
        </div>
      </div>
      {editRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2>Edit Request #{editRequest.id}</h2>
            <div className="space-y-4">
              <div>
                <label>Quantity:</label>
                <input
                  type="text"
                  name="quantity"
                  value={editForm.quantity}
                  onChange={handleEditChange}
                  className="border rounded-md px-2 py-1 w-full"
                />
              </div>
              <div>
                <label>Delivery Date:</label>
                <input
                  type="date"
                  name="delivery_date"
                  value={editForm.delivery_date}
                  onChange={handleEditChange}
                  className="border rounded-md px-2 py-1 w-full"
                />
              </div>
              <div>
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  className="border rounded-md px-2 py-1 w-full"
                />
              </div>
              <button
                onClick={submitEditForm}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
              <button
                onClick={closeEditModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyActivity;
