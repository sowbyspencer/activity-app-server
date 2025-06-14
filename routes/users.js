const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getUserProfile } = require("../queries/users");
const pool = require("../db.ts");

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/users")); // Corrected path
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Route to fetch user profile by ID
// Test URL: http://10.244.131.46:5000/users/:id (replace :id with the user ID)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("[USERS] Fetching user profile for id:", id);

  try {
    const userProfile = await getUserProfile(id);
    if (!userProfile) {
      console.warn("[USERS] User not found for id:", id);
      return res.status(404).json({ error: "User not found." });
    }
    console.log("[USERS] Successfully fetched user profile for id:", id);
    res.json(userProfile);
  } catch (err) {
    console.error("[USERS] Error fetching user profile for id:", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch user profile. Please try again later." });
  }
});

// Route to update user profile
router.put("/:id", upload.single("profileImage"), async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  const profileImage = req.file
    ? `${process.env.IMAGE_PATH}/users/${req.file.filename}`
    : null;

  console.log("[USERS] Received update request:", {
    id,
    firstName,
    lastName,
    email,
    profileImage,
  });

  try {
    const currentProfile = await pool.query(
      `SELECT profile_image FROM "user" WHERE id = $1`,
      [id]
    );

    if (currentProfile.rows.length === 0) {
      console.error("User not found:", id);
      return res.status(404).json({ error: "User not found" });
    }

    const oldImagePath = currentProfile.rows[0].profile_image;

    if (
      profileImage &&
      oldImagePath &&
      oldImagePath.startsWith(process.env.IMAGE_PATH)
    ) {
      const localPath = path.join(
        __dirname,
        "../public/images/users",
        path.basename(oldImagePath)
      );
      fs.unlink(localPath, (err) => {
        if (err)
          console.error("Error deleting old profile image:", err.message);
      });
    }

    const query = `
      UPDATE "user"
      SET first_name = $1, last_name = $2, email = $3, profile_image = COALESCE($4, profile_image)
      WHERE id = $5
      RETURNING id, first_name AS "firstName", last_name AS "lastName", email, profile_image AS "profileImage";
    `;
    const values = [firstName, lastName, email, profileImage, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      console.error("Failed to update user profile:", id);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("[USERS] User profile updated successfully:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user profile:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to update user password
router.put("/:id/password", async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Current and new password are required." });
  }
  try {
    // Get the user's hashed password
    const userResult = await pool.query(
      'SELECT password FROM "user" WHERE id = $1',
      [id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    const hashedPassword = userResult.rows[0].password;
    // Compare current password
    const bcrypt = require("bcrypt");
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }
    // Hash new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    // Update password in DB
    await pool.query('UPDATE "user" SET password = $1 WHERE id = $2', [
      newHashedPassword,
      id,
    ]);
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("[USERS] Error updating password:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to delete user account
router.post("/:id/delete", async (req, res) => {
  const { id } = req.params;
  const { password, validateOnly } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }
  try {
    // Get the user's hashed password
    const userResult = await pool.query(
      'SELECT password FROM "user" WHERE id = $1',
      [id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    const hashedPassword = userResult.rows[0].password;
    const bcrypt = require("bcrypt");
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Password is incorrect." });
    }
    if (validateOnly) {
      return res.json({ message: "Password validated." });
    }
    // Delete user and related data (customize as needed)
    await pool.query('DELETE FROM "user" WHERE id = $1', [id]);
    // Optionally: delete related data (activities, chats, etc.)
    res.json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("[USERS] Error deleting account:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
