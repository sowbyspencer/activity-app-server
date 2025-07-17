// -----------------------------------------------------------------------------
// users.js - Database queries for user profile, authentication, and management
// -----------------------------------------------------------------------------
// Contains all SQL/database logic for:
//   - Fetching and updating user profiles
//   - Password management
//   - User image management
//   - User deletion and related chat cleanup
//
// Exports: Query functions for use in Express routes
// -----------------------------------------------------------------------------

const pool = require("../db.ts");
let chalk;
(async () => {
  chalk = (await import("chalk")).default;
})();

// Query to fetch user profile by ID
const getUserProfile = async (id) => {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name AS "firstName", last_name AS "lastName", profile_image AS "profileImage"
       FROM "user"
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  } catch (err) {
    console.error(chalk.red("Error fetching user profile:"), err.message);
    throw err;
  }
};

// Update user password by ID
const updateUserPassword = async (id, newHashedPassword) => {
  try {
    await pool.query('UPDATE "user" SET password = $1 WHERE id = $2', [newHashedPassword, id]);
    return true;
  } catch (err) {
    console.error(chalk.red("Error updating user password:"), err.message);
    throw err;
  }
};

// Update user profile by ID
const updateUserProfile = async (id, firstName, lastName, email, profileImage) => {
  const query = `
    UPDATE "user"
    SET first_name = $1, last_name = $2, email = $3, profile_image = COALESCE($4, profile_image)
    WHERE id = $5
    RETURNING id, first_name AS "firstName", last_name AS "lastName", email, profile_image AS "profileImage";
  `;
  const values = [firstName, lastName, email, profileImage, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get current profile image path
const getUserProfileImage = async (id) => {
  const result = await pool.query(`SELECT profile_image FROM "user" WHERE id = $1`, [id]);
  return result.rows[0]?.profile_image;
};

// Get user hashed password
const getUserHashedPassword = async (id) => {
  const result = await pool.query('SELECT password FROM "user" WHERE id = $1', [id]);
  return result.rows[0]?.password;
};

// Delete user by ID
const deleteUserById = async (id) => {
  await pool.query('DELETE FROM "user" WHERE id = $1', [id]);
};

// Get direct chat IDs for user
const getDirectChatIdsForUser = async (id) => {
  const result = await pool.query(
    `SELECT c.id FROM chat c
     JOIN chat_member cm ON c.id = cm.chat_id
     WHERE cm.user_id = $1 AND c.chat_type = 'direct'`,
    [id]
  );
  return result.rows.map((row) => row.id);
};

// Delete chat by ID
const deleteChatById = async (chatId) => {
  await pool.query("DELETE FROM chat WHERE id = $1", [chatId]);
};

module.exports = {
  getUserProfile,
  updateUserPassword,
  updateUserProfile,
  getUserProfileImage,
  getUserHashedPassword,
  deleteUserById,
  getDirectChatIdsForUser,
  deleteChatById,
};
