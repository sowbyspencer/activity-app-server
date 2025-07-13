const express = require("express");
const router = express.Router();
let chalk;
(async () => {
  chalk = (await import("chalk")).default;
})();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getUserProfile,
  updateUserProfile,
  getUserProfileImage,
  getUserHashedPassword,
  updateUserPassword,
  deleteUserById,
  getDirectChatIdsForUser,
  deleteChatById,
} = require("../queries/users");
const pool = require("../db.ts");

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
  console.log(chalk.white("[USERS] Fetching user profile for id:"), id);

  try {
    const userProfile = await getUserProfile(id);
    if (!userProfile) {
      console.warn(chalk.red("[USERS] User not found for id:"), id);
      return res.status(404).json({ error: "User not found." });
    }
    console.log(chalk.green("[USERS] Successfully fetched user profile for id:"), id);
    res.json(userProfile);
  } catch (err) {
    console.error(chalk.red("[USERS] Error fetching user profile for id:"), err.message);
    res.status(500).json({ error: "Failed to fetch user profile. Please try again later." });
  }
});

// Route to update user profile
router.put("/:id", upload.single("profileImage"), async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  const profileImage = req.file ? `${process.env.IMAGE_PATH}/users/${req.file.filename}` : null;

  console.log(chalk.white("[USERS] Received update request:"), {
    id,
    firstName,
    lastName,
    email,
    profileImage,
  });

  try {
    // Check if user exists
    const userProfile = await getUserProfile(id);
    if (!userProfile) {
      console.error(chalk.red("User not found:"), id);
      return res.status(404).json({ error: "User not found" });
    }
    // Get old image path (may be null)
    const oldImagePath = userProfile.profileImage;
    if (profileImage) {
      if (oldImagePath && typeof oldImagePath === "string" && oldImagePath.startsWith(process.env.IMAGE_PATH)) {
        const localPath = path.join(__dirname, "../public/images/users", path.basename(oldImagePath));
        fs.unlink(localPath, (err) => {
          if (err) console.error(chalk.red("Error deleting old profile image:"), err.message);
        });
      } else {
        console.warn(chalk.yellow("Previous profile image path was NULL or not a string, skipping delete."));
      }
    }
    const updatedProfile = await updateUserProfile(id, firstName, lastName, email, profileImage);
    if (!updatedProfile) {
      console.error(chalk.red("Failed to update user profile:"), id);
      return res.status(404).json({ error: "User not found" });
    }
    console.log(chalk.green("[USERS] User profile updated successfully:"), updatedProfile);
    res.json(updatedProfile);
  } catch (err) {
    console.error(chalk.red("Error updating user profile:"), err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to update user password
router.put("/:id/password", async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password are required." });
  }
  try {
    const hashedPassword = await getUserHashedPassword(id);
    if (!hashedPassword) {
      return res.status(404).json({ error: "User not found." });
    }
    const bcrypt = require("bcrypt");
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(id, newHashedPassword);
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error(chalk.red("[USERS] Error updating password:"), err.message);
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
    const hashedPassword = await getUserHashedPassword(id);
    if (!hashedPassword) {
      return res.status(404).json({ error: "User not found." });
    }
    const bcrypt = require("bcrypt");
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Password is incorrect." });
    }
    if (validateOnly) {
      return res.json({ message: "Password validated." });
    }
    await pool.query("BEGIN");
    const directChatIds = await getDirectChatIdsForUser(id);
    await deleteUserById(id);
    for (const chatId of directChatIds) {
      await deleteChatById(chatId);
    }
    await pool.query("COMMIT");
    res.json({ message: "Account and related direct chats deleted successfully." });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(chalk.red("[USERS] Error deleting account:"), err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
