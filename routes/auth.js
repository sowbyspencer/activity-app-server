const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getAllRegisteredUsers } = require("../queries/auth");

// Update the /register route to include user-friendly error responses
router.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  console.log("[REGISTER] Request received with data:", {
    email,
    first_name,
    last_name,
  });
  try {
    const result = await registerUser({ email, password, first_name, last_name });
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(201).json({ message: result.message });
  } catch (err) {
    console.error("[REGISTER] Error registering user:", err.message);
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
});

// Add detailed logging to the /login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("[LOGIN] Request received with email:", email);
  try {
    const result = await loginUser({ email, password, jwtSecret: process.env.JWT_SECRET });
    if (result.error) {
      return res.status(401).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    console.error("[LOGIN] Error logging in user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Add detailed logging to the /verify-registration route
router.get("/verify-registration", async (req, res) => {
  console.log("[VERIFY-REGISTRATION] Request received");
  try {
    const users = await getAllRegisteredUsers();
    console.log("[VERIFY-REGISTRATION] Retrieved users from database:", users);
    res.json(users);
  } catch (err) {
    console.error("[VERIFY-REGISTRATION] Error verifying registration:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
