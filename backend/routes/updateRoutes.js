const express = require("express");
const { updateUser } = require("../controllers/updateController");
const router = express.Router();

router.put("/profile/:id", updateUser);

module.exports = router;
