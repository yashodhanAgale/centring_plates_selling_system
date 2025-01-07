// controllers/requestController.js
const db = require("../config/db"); // Database connection

// Show all requests with pagination
const getAllRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is provided
    const limit = 25; // 25 requests per page
    const offset = (page - 1) * limit;

    // Query to fetch the requests
    const [results] = await db.query(
      `
      SELECT * FROM requests
      LIMIT ?, ?;
    `,
      [offset, limit]
    );

    // Query to fetch total number of requests
    const [[countResult]] = await db.query(
      "SELECT COUNT(*) AS totalRequests FROM requests;"
    );

    const totalRequests = countResult.totalRequests;
    res.json({
      requests: results,
      totalRequests,
      totalPages: Math.ceil(totalRequests / limit), // Calculate total number of pages
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching requests:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// controllers/requestController.js (Add this to the same file)
const updateRequestStatus = async (req, res) => {
  const { id } = req.params; // Request ID from URL parameter
  const { status } = req.body; // New status from the request body

  const allowedStatuses = ["Pending", "Contacted", "In Process", "Completed"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    // Query to update the status of the request
    const [result] = await db.query(
      "UPDATE requests SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request status updated successfully" });
  } catch (err) {
    console.error("Error updating request status:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// controllers/requestController.js (Add this to the same file)
const deleteRequest = async (req, res) => {
  const { id } = req.params; // Request ID from URL parameter

  try {
    // Query to delete the request
    const [result] = await db.query("DELETE FROM requests WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error("Error deleting request:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
};
