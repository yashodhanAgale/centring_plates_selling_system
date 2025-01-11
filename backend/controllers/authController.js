const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
  return emailRegex.test(email);
};

// Password validation function
const isValidPassword = (password) => {
  const passwordRegex = /^\d{4,6}$/; // Only 4-6 digits allowed
  return passwordRegex.test(password);
};

// vslidate the phone number

// const isValidPhoneNumber = (phoneNumber) => {
//   const phoneRegex = /^\d{10}$/; // Only 10 digits allowed
//   return phoneRegex.test(phoneNumber);
// };
// Signup Controller
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Validate password format (4-6 digits)
    if (!isValidPassword(password)) {
      return res.status(400).json({ msg: "Password must be 4-6 digits" });
    }

    //validate the phone number
    // if (!isValidPhoneNumber(phoneNumber)) {
    //   return res.status(400).json({ msg: "Invalid phone number" });
    // }

    // Check if the user already exists
    const [result] = await db.query("SELECT email FROM users WHERE email = ?", [
      email,
    ]);

    if (result.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Insert user into the database
    await db.query(
      "INSERT INTO users ( email, password, name) VALUES (?, ?, ?)",
      [email, hash, name]
    );

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Check if the user exists
    const [result] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // If user doesn't exist
    if (result.length === 0) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const user = result[0];

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If password does not match
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Generate a token with the user's full name
    const token = jwt.sign(
      {
        name: user.name,
        id: user.id,
        role: user.role,
        email: user.email,
      },
      (secretKey = "yash")
    );

    // Password is correct, proceed with login
    res.status(200).json({
      msg: "Login successful",
      token, // Send the token back to the client
      user: {
        email: user.email,
        name: user.name,
        id: user.id,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
    });
    console.log(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const { userId, email, password, name, currentPassword } = req.body;

  // Validate required fields
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch the current user details
    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [
      userId,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No user found with the provided ID" });
    }

    const existingUser = rows[0];

    // Validate the current password if provided
    if (currentPassword) {
      const passwordMatch = bcrypt.compareSync(
        currentPassword,
        existingUser.password
      );
      if (!passwordMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
    }

    // Prevent setting the new password as the old password
    let hashedPassword = null;
    if (password) {
      const isSamePassword = bcrypt.compareSync(
        password,
        existingUser.password
      );
      if (isSamePassword) {
        return res.status(400).json({
          error: "New password cannot be the same as the old password",
        });
      }
      hashedPassword = bcrypt.hashSync(password, 10); // Salt rounds = 10
    }

    // Build the update query
    const fieldsToUpdate = [];
    const values = [];

    if (email) {
      fieldsToUpdate.push("email = ?");
      values.push(email);
    }
    if (name) {
      fieldsToUpdate.push("name = ?");
      values.push(name);
    }
    if (hashedPassword) {
      fieldsToUpdate.push("password = ?");
      values.push(hashedPassword);
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const query = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    values.push(userId);

    // Execute the query
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Error updating profile" });
  }
};

// Export both signup and login functions
module.exports = { signup, login, updateUser };

// const bcrypt = require("bcryptjs");
// const db = require("../config/db");

// // Email validation function
// const isValidEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
//   return emailRegex.test(email);
// };

// // Password validation function
// const isValidPassword = (password) => {
//   const passwordRegex = /^\d{4,6}$/; // Only 4-6 digits allowed
//   return passwordRegex.test(password);
// };

// // Signup Controller
// const signup = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Validate email format
//     if (!isValidEmail(email)) {
//       return res.status(400).json({ msg: "Invalid email format" });
//     }

//     // Validate password format (4-6 digits)
//     if (!isValidPassword(password)) {
//       return res.status(400).json({ msg: "Password must be 4-6 digits" });
//     }

//     // Check if the user already exists
//     const [result] = await db.query("SELECT email FROM users WHERE email = ?", [
//       email,
//     ]);

//     if (result.length > 0) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     // Hash the password
//     const hash = await bcrypt.hash(password, 10);

//     // Insert user into the database
//     await db.query(
//       "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
//       [email, hash, name]
//     );

//     res.status(201).json({ msg: "User registered successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Validate email format
//     if (!isValidEmail(email)) {
//       return res.status(400).json({ msg: "Invalid email format" });
//     }

//     // Check if the user exists
//     const [result] = await db.query("SELECT * FROM users WHERE email = ?", [
//       email,
//     ]);

//     // If user doesn't exist
//     if (result.length === 0) {
//       return res.status(400).json({ msg: "User does not exist" });
//     }

//     const user = result[0];

//     // Compare the password with the hashed password
//     const isMatch = await bcrypt.compare(password, user.password);

//     // If password does not match
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid password" });
//     }

//     // Generate a token
//     const token = jwt.sign(
//       { name: user.name, id: user.id, role: user.role, email: user.email },
//       "yash" // Secret key should be in environment variables
//     );

//     res.status(200).json({
//       msg: "Login successful",
//       token, // Send the token back to the client
//       user: {
//         email: user.email,
//         name: user.name,
//         id: user.id,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// };

// const updateUser = async (req, res) => {
//   const { userId, email, password, name, currentPassword } = req.body;

//   // Validate required fields
//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   try {
//     // Fetch the current user details
//     const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [
//       userId,
//     ]);

//     if (rows.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No user found with the provided ID" });
//     }

//     const existingUser = rows[0];

//     // Validate the current password if provided
//     if (currentPassword) {
//       const passwordMatch = bcrypt.compareSync(
//         currentPassword,
//         existingUser.password
//       );
//       if (!passwordMatch) {
//         return res.status(401).json({ error: "Current password is incorrect" });
//       }
//     }

//     // Prevent setting the new password as the old password
//     let hashedPassword = null;
//     if (password) {
//       const isSamePassword = bcrypt.compareSync(
//         password,
//         existingUser.password
//       );
//       if (isSamePassword) {
//         return res.status(400).json({
//           error: "New password cannot be the same as the old password",
//         });
//       }
//       hashedPassword = bcrypt.hashSync(password, 10); // Salt rounds = 10
//     }

//     // Build the update query
//     const fieldsToUpdate = [];
//     const values = [];

//     if (email) {
//       fieldsToUpdate.push("email = ?");
//       values.push(email);
//     }
//     if (name) {
//       fieldsToUpdate.push("name = ?");
//       values.push(name);
//     }
//     if (hashedPassword) {
//       fieldsToUpdate.push("password = ?");
//       values.push(hashedPassword);
//     }

//     if (fieldsToUpdate.length === 0) {
//       return res.status(400).json({ error: "No fields to update" });
//     }

//     // Perform the update
//     await db.query(
//       `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
//       [...values, userId]
//     );

//     res.json({ message: "User updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred while updating user" });
//   }
// };

// module.exports = { signup, login, updateUser };
