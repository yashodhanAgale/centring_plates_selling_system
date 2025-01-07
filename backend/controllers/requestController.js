const db = require("../config/db");

// Request centring plates
exports.createRequest = async (req, res) => {
  try {
    const { user_id, name, quantity, delivery_date, address, phone_number } =
      req.body;

    // Validation: Ensure all required fields are present
    if (
      !user_id ||
      !name ||
      !quantity ||
      !delivery_date ||
      !address ||
      !phone_number
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validation: Delivery date should be in the future
    const currentDate = new Date();
    const deliveryDate = new Date(delivery_date);
    if (deliveryDate <= currentDate) {
      return res
        .status(400)
        .json({ message: "Delivery date must be in the future." });
    }

    // Validation: Phone number should be exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone_number)) {
      return res
        .status(400)
        .json({ message: "Phone number must be exactly 10 digits." });
    }

    // Insert request into the database
    const query = `
      INSERT INTO requests (user_id, name, quantity, delivery_date, address, phone_number)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      user_id,
      name,
      quantity,
      delivery_date,
      address,
      phone_number,
    ]);

    res.status(201).json({
      message: "Request created successfully.",
      requestId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the request." });
  }
};

// Get all requests for a specific user
exports.getUserRequests = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const query = `
      SELECT id, quantity, delivery_date, address, phone_number, status, created_at
      FROM requests
      WHERE user_id = ?
    `;
    const [rows] = await db.execute(query, [user_id]);

    res.status(200).json({
      message: "Requests retrieved successfully.",
      requests: rows,
    });
  } catch (error) {
    console.error("Error retrieving user requests:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the requests." });
  }
};

// Controller to update a single or multiple fields of a request
exports.updateRequest = async (req, res) => {
  const { id } = req.params; // Request ID to update
  const { quantity, delivery_date, address } = req.body; // Fields to potentially update

  // Ensure at least one field is provided
  if (!quantity && !delivery_date && !address) {
    return res.status(400).json({
      success: false,
      message: "At least one field must be provided to update.",
    });
  }

  // Build the update query dynamically
  const updates = [];
  const values = [];

  if (quantity) {
    updates.push("quantity = ?");
    values.push(quantity);
  }
  if (delivery_date) {
    updates.push("delivery_date = ?");
    values.push(delivery_date);
  }
  if (address) {
    updates.push("address = ?");
    values.push(address);
  }

  // Add the ID to the values array for the WHERE clause
  values.push(id);

  // Construct the SQL query
  const query = `UPDATE requests SET ${updates.join(", ")} WHERE id = ?`;

  try {
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the request.",
    });
  }
};
