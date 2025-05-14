const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db.ts");

const router = express.Router();

// Update the /register route to include user-friendly error responses
router.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  console.log("[REGISTER] Request received with data:", {
    email,
    first_name,
    last_name,
  });

  try {
    // Check if the email already exists in the database
    const emailCheck = await pool.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email]
    );
    if (emailCheck.rows.length > 0) {
      console.warn("[REGISTER] Duplicate email detected:", email);
      return res.status(400).json({
        error:
          "The email address is already registered. Please use a different email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("[REGISTER] Password hashed successfully");

    await pool.query(
      `INSERT INTO "user" (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)`,
      [email, hashedPassword, first_name, last_name]
    );
    console.log("[REGISTER] User inserted into database successfully");

    res
      .status(201)
      .json({ message: "Registration successful! You can now log in." });
  } catch (err) {
    console.error("[REGISTER] Error registering user:", err.message);

    if (err.constraint === "unique_email") {
      return res.status(400).json({
        error:
          "The email address is already registered. Please use a different email.",
      });
    }

    res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
});

// Add detailed logging to the /login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("[LOGIN] Request received with email:", email);

  try {
    const result = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [
      email,
    ]);
    const user = result.rows[0];
    console.log("[LOGIN] User object from DB:", user); // Log the user object

    if (!user) {
      console.warn("[LOGIN] User not found for email:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.warn("[LOGIN] Invalid password for email:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("[LOGIN] User authenticated successfully for email:", email);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("[LOGIN] JWT token generated for user:", email);

    const responseData = { token, user_id: user.id };
    console.log("[LOGIN] Response data sent to client:", responseData); // Log the response data
    res.json(responseData); // Include user_id in the response
  } catch (err) {
    console.error("[LOGIN] Error logging in user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Add detailed logging to the /verify-registration route
router.get("/verify-registration", async (req, res) => {
  console.log("[VERIFY-REGISTRATION] Request received");

  try {
    const result = await pool.query(
      'SELECT email, first_name, last_name FROM "user"'
    );
    console.log(
      "[VERIFY-REGISTRATION] Retrieved users from database:",
      result.rows
    );

    res.json(result.rows);
  } catch (err) {
    console.error(
      "[VERIFY-REGISTRATION] Error verifying registration:",
      err.message
    );
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
