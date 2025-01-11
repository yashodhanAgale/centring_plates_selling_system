const express = require("express");
const cors = require("cors");
const db = require("./config/db"); // This will establish the connection
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();

require("dotenv").config();

// Middleware
// app.use(
//   cors({
//     origin: "https://centring-plates-selling-fm3w.vercel.app",
//   })
// );
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.use("/auth", authRoutes);
app.use("/request", requestRoutes);
app.use("/otp", verificationRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
server.timeout = 60000;
