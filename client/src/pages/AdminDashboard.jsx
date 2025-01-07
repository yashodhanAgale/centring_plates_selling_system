// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import ConstantHeaderAdmin from "../components/ConstantHeaderAdmin";

// const AdminDashboard = () => {
//   const { user } = useAuth();
//   const [requests, setRequests] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [activeTab, setActiveTab] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRequest, setEditingRequest] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [deletingRequest, setDeletingRequest] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");

//   // Fetch requests from API
//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5001/admin/all-requests?page=${currentPage}`
//         );
//         const data = await response.json();
//         setRequests(data.requests);
//         setTotalPages(data.totalPages);
//         setFilteredRequests(data.requests);
//       } catch (error) {
//         console.error("Error fetching requests:", error);
//       }
//     };
//     fetchRequests();
//   }, [currentPage]);

//   // Handle tab change and filtering
//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     filterRequests(tab);
//   };

//   // Filter requests based on status and search query
//   const filterRequests = (status) => {
//     const filtered = requests.filter((request) => {
//       const statusMatches = status === "all" || request.status === status;
//       const searchMatches =
//         request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         request.delivery_date.includes(searchQuery) ||
//         request.phone_number.includes(searchQuery) ||
//         request.quantity.toString().includes(searchQuery);
//       return statusMatches && searchMatches;
//     });
//     setFilteredRequests(filtered);
//   };

//   // Handle search query change
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//     filterRequests(activeTab); // Filter based on the active tab and search query
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const options = {
//       weekday: "short",
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString("en-US", options);
//   };

//   // Update Status
//   const handleUpdateStatus = async () => {
//     if (!editingRequest || !editingRequest.status) return;
//     try {
//       const response = await fetch(
//         `http://localhost:5001/admin/update-status/${editingRequest.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             status: editingRequest.status,
//           }),
//         }
//       );
//       if (response.ok) {
//         setSuccessMessage("Request updated successfully!");
//         setIsEditing(false);
//         setEditingRequest(null);
//         setTimeout(() => setSuccessMessage(""), 5000);
//         fetchRequests();
//       } else {
//         console.error("Failed to update status");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   // Delete Request
//   const handleDeleteRequest = async () => {
//     if (!deletingRequest) return;
//     try {
//       const response = await fetch(
//         `http://localhost:5001/admin/delete-request/${deletingRequest.id}`,
//         {
//           method: "DELETE",
//         }
//       );
//       if (response.ok) {
//         setSuccessMessage("Request deleted successfully!");
//         setIsDeleting(false);
//         setDeletingRequest(null);
//         setTimeout(() => setSuccessMessage(""), 5000);
//         fetchRequests();
//       } else {
//         console.error("Failed to delete request");
//       }
//     } catch (error) {
//       console.error("Error deleting request:", error);
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <ConstantHeaderAdmin />

//       {/* Main Content */}
//       <div className="p-6 max-w-screen-lg mx-auto">
//         <h1 className="text-3xl font-semibold mb-6 text-center">
//           Hello {user?.name}, Welcome to Admin Dashboard
//         </h1>

//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
//             {successMessage}
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="mb-6 flex justify-center">
//           <ul className="flex space-x-6">
//             {["all", "Pending", "Contacted", "In Process", "Completed"].map(
//               (tab) => (
//                 <li
//                   key={tab}
//                   className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
//                     activeTab === tab
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200 text-gray-700 hover:bg-blue-200"
//                   }`}
//                   onClick={() => handleTabChange(tab)}
//                 >
//                   {tab}
//                 </li>
//               )
//             )}
//           </ul>
//         </div>

//         {/* Search Bar */}
//         <div className="mb-6 flex justify-center space-x-4">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             placeholder="Search by name, delivery date, phone number, quantity"
//             className="p-2 w-full sm:w-1/2 lg:w-1/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto shadow-lg rounded-lg">
//           <table className="min-w-full table-auto text-sm text-gray-800">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="px-4 py-2 text-left">Request ID</th>
//                 <th className="px-4 py-2 text-left">User Name</th>
//                 <th className="px-4 py-2 text-left">Quantity</th>
//                 <th className="px-4 py-2 text-left">Delivery Date</th>
//                 <th className="px-4 py-2 text-left">Address</th>
//                 <th className="px-4 py-2 text-left">Phone Number</th>
//                 <th className="px-4 py-2 text-left">Status</th>
//                 <th className="px-4 py-2 text-left">Created At</th>
//                 <th className="px-4 py-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredRequests.map((request) => (
//                 <tr key={request.id} className="border-b hover:bg-gray-100">
//                   <td className="px-4 py-2">{request.id}</td>
//                   <td className="px-4 py-2">{request.name}</td>
//                   <td className="px-4 py-2">{request.quantity}</td>
//                   <td className="px-4 py-2">
//                     {formatDate(request.delivery_date)}
//                   </td>
//                   <td className="px-4 py-2">{request.address}</td>
//                   <td className="px-4 py-2">{request.phone_number}</td>
//                   <td className="px-4 py-2">{request.status}</td>
//                   <td className="px-4 py-2">
//                     {formatDate(request.created_at)}
//                   </td>
//                   <td className="px-4 py-2 flex space-x-2">
//                     <button
//                       onClick={() => {
//                         setEditingRequest(request);
//                         setIsEditing(true);
//                       }}
//                       className="text-blue-500 hover:text-blue-700"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => {
//                         setDeletingRequest(request);
//                         setIsDeleting(true);
//                       }}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-300 rounded-l-lg disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="px-4 py-2">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-300 rounded-r-lg disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {isEditing && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded shadow-lg w-1/3">
//             <h2 className="text-2xl mb-4">Edit Request Status</h2>
//             <div>
//               <label className="block mb-2">Status</label>
//               <select
//                 className="w-full p-2 border border-gray-300 rounded"
//                 value={editingRequest.status}
//                 onChange={(e) =>
//                   setEditingRequest((prev) => ({
//                     ...prev,
//                     status: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="Pending">Pending</option>
//                 <option value="Contacted">Contacted</option>
//                 <option value="In Process">In Process</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>
//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={handleUpdateStatus}
//                 className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="bg-gray-300 px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {isDeleting && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded shadow-lg w-1/3">
//             <h2 className="text-2xl mb-4">
//               Are you sure you want to delete this request?
//             </h2>
//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={handleDeleteRequest}
//                 className="bg-red-500 text-white px-4 py-2 rounded mr-2"
//               >
//                 Yes, Delete
//               </button>
//               <button
//                 onClick={() => setIsDeleting(false)}
//                 className="bg-gray-300 px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ConstantHeaderAdmin from "../components/ConstantHeaderAdmin";

const AdminDashboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingRequest, setDeletingRequest] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/admin/all-requests?page=${currentPage}`
        );
        const data = await response.json();
        setRequests(data.requests);
        setTotalPages(data.totalPages);
        setFilteredRequests(data.requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, [currentPage]);

  // Handle tab change and filtering
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    filterRequests(tab);
  };

  // Filter requests based on status and search query
  const filterRequests = (status) => {
    const filtered = requests.filter((request) => {
      const statusMatches = status === "all" || request.status === status;
      const searchMatches =
        request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.delivery_date.includes(searchQuery) ||
        request.phone_number.includes(searchQuery) ||
        request.quantity.toString().includes(searchQuery);
      return statusMatches && searchMatches;
    });
    setFilteredRequests(filtered);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterRequests(activeTab); // Filter based on the active tab and search query
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Update Status
  const handleUpdateStatus = async () => {
    if (!editingRequest || !editingRequest.status) return;
    try {
      const response = await fetch(`${apiUrl}/${editingRequest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: editingRequest.status,
        }),
      });
      if (response.ok) {
        setSuccessMessage("Request updated successfully!");
        setIsEditing(false);
        setEditingRequest(null);
        setTimeout(() => setSuccessMessage(""), 5000);
        fetchRequests();
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete Request
  const handleDeleteRequest = async () => {
    if (!deletingRequest) return;
    try {
      const response = await fetch(
        `${apiUrl}/admin/delete-request/${deletingRequest.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setSuccessMessage("Request deleted successfully!");
        setIsDeleting(false);
        setDeletingRequest(null);
        setTimeout(() => setSuccessMessage(""), 5000);
        fetchRequests();
      } else {
        console.error("Failed to delete request");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <ConstantHeaderAdmin />

      {/* Main Content */}
      <div className="p-6 max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Hello {user?.name}, Welcome to Admin Dashboard
        </h1>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
            {successMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex justify-center">
          <ul className="flex space-x-4 sm:space-x-6">
            {["all", "Pending", "Contacted", "In Process", "Completed"].map(
              (tab) => (
                <li
                  key={tab}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-200"
                  }`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, delivery date, phone number, quantity"
            className="p-2 w-full sm:w-1/2 lg:w-1/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full table-auto text-sm text-gray-800">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Request ID</th>
                <th className="px-4 py-2 text-left">User Name</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Delivery Date</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Phone Number</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{request.id}</td>
                  <td className="px-4 py-2">{request.name}</td>
                  <td className="px-4 py-2">{request.quantity}</td>
                  <td className="px-4 py-2">
                    {formatDate(request.delivery_date)}
                  </td>
                  <td className="px-4 py-2">{request.address}</td>
                  <td className="px-4 py-2">{request.phone_number}</td>
                  <td className="px-4 py-2">{request.status}</td>
                  <td className="px-4 py-2">
                    {formatDate(request.created_at)}
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingRequest(request);
                        setIsEditing(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeletingRequest(request);
                        setIsDeleting(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-l-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm sm:text-base">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-r-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full sm:w-1/3">
            <h2 className="text-2xl mb-4">Edit Request Status</h2>
            <div>
              <label className="block mb-2">Status</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={editingRequest.status}
                onChange={(e) =>
                  setEditingRequest((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="In Process">In Process</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full sm:w-1/3">
            <h2 className="text-2xl mb-4">Delete Request</h2>
            <p>Are you sure you want to delete this request?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleDeleteRequest}
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 bg-gray-300 rounded"
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

export default AdminDashboard;
