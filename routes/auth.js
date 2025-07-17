// -----------------------------------------------------------------------------
// auth.js - Express routes for user authentication
// -----------------------------------------------------------------------------
// Handles API endpoints for:
//   - User registration
//   - User login
//   - Fetching all registered users
//
// Exports: Express router
// -----------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
let chalk;
(async () => {
  chalk = (await import("chalk")).default;
})();
const { registerUser, loginUser, getAllRegisteredUsers } = require("../queries/auth");

// Route: POST /auth/register
// Registers a new user. Requires email, password, first/last name, and profile image.
// Responds with 400 if missing fields or duplicate email, 201 on success.
router.post("/register", async (req, res) => {
  const { email, password, first_name, last_name, profile_image } = req.body;
  console.log(chalk.white("[REGISTER] Request received with data:"), {
    email,
    first_name,
    last_name,
    profile_image,
  });
  if (!profile_image) {
    // Profile image is required
    return res.status(400).json({ error: "Profile image is required." });
  }
  try {
    // Call DB query to register user
    const result = await registerUser({ email, password, first_name, last_name, profile_image });
    if (result.error) {
      // Registration failed (duplicate email, etc.)
      return res.status(400).json({ error: result.error });
    }
    // Success: user registered
    res.status(201).json({ message: result.message });
  } catch (err) {
    // Handle DB or server errors
    console.error(chalk.red("[REGISTER] Error registering user:"), err.message);
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
});

// Add detailed logging to the /login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(chalk.white("[LOGIN] Request received with email:"), email);
  try {
    const result = await loginUser({ email, password, jwtSecret: process.env.JWT_SECRET });
    if (result.error) {
      return res.status(401).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    console.error(chalk.red("[LOGIN] Error logging in user:"), err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Add detailed logging to the /verify-registration route
router.get("/verify-registration", async (req, res) => {
  console.log(chalk.white("[VERIFY-REGISTRATION] Request received"));
  try {
    const users = await getAllRegisteredUsers();
    console.log(chalk.green("[VERIFY-REGISTRATION] Retrieved users from database:"), users);
    res.json(users);
  } catch (err) {
    console.error(chalk.red("[VERIFY-REGISTRATION] Error verifying registration:"), err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Export the router for use in the main server
module.exports = router;
