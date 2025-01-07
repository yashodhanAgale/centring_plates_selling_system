const express = require("express");
const {
  createRequest,
  getUserRequests,
  updateRequest,
} = require("../controllers/requestController");
const router = express.Router();

router.post("/centring-plates", createRequest);
router.get("/my-activity/:user_id", getUserRequests);
router.put("/update-request/:id", updateRequest);

module.exports = router;
