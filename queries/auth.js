// -----------------------------------------------------------------------------
// auth.js - Database queries for user authentication
// -----------------------------------------------------------------------------
// Contains SQL/database logic for:
//   - Registering users
//   - Logging in users
//   - Fetching all registered users
//
// Exports: Query functions for use in Express routes
// -----------------------------------------------------------------------------

const pool = require("../db.ts");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Register a new user in the database.
 * Checks for duplicate email, hashes password, and inserts user.
 *
 * @param {object} user - User registration info
 * @returns {Promise<object>} Success or error message
 */
const registerUser = async ({ email, password, first_name, last_name, profile_image }) => {
  if (!profile_image) {
    // Profile image is required
    return { error: "Profile image is required." };
  }
  // Check if the email already exists
  const emailCheck = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
  if (emailCheck.rows.length > 0) {
    // Email already registered
    return { error: "The email address is already registered. Please use a different email." };
  }
  // Hash the password and insert user
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(`INSERT INTO "user" (email, password, first_name, last_name, profile_image) VALUES ($1, $2, $3, $4, $5)`, [
    email,
    hashedPassword,
    first_name,
    last_name,
    profile_image || null,
  ]);
  return { message: "Registration successful! You can now log in." };
};

/**
 * Log in a user by verifying credentials and issuing a JWT.
 *
 * @param {object} login - Login info (email, password, jwtSecret)
 * @returns {Promise<object>} User info and JWT or error
 */
const loginUser = async ({ email, password, jwtSecret }) => {
  const result = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
  const user = result.rows[0];
  if (!user) {
    // No user found for this email
    return { error: "Invalid email or password." };
  }
  // Compare password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // Password does not match
    return { error: "Invalid email or password." };
  }
  // Generate JWT
  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: "7d" });
  return {
    user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, profile_image: user.profile_image },
    token,
  };
};

// Export the query functions for use in routes
module.exports = { registerUser, loginUser };
