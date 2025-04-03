const express = require("express");
const multer = require("multer");
const path = require("path");
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
  try {
    const userProfile = await getUserProfile(id);
    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(userProfile);
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to update user profile
router.put("/:id", upload.single("profileImage"), async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  const profileImage = req.file
    ? `${process.env.IMAGE_PATH}/users/${req.file.filename}`
    : null;

  try {
    const query = `
      UPDATE "user"
      SET first_name = $1, last_name = $2, email = $3, profile_image = COALESCE($4, profile_image)
      WHERE id = $5
      RETURNING id, first_name AS "firstName", last_name AS "lastName", email, profile_image AS "profileImage";
    `;
    const values = [firstName, lastName, email, profileImage, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user profile:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
