const express = require("express");
const {
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
} = require("../controllers/adminController");
const router = express.Router();

router.get("/all-requests", getAllRequests);
router.put("/update-status/:id", updateRequestStatus);
router.delete("/delete-request/:id", deleteRequest);

module.exports = router;
