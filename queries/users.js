const pool = require("../db.ts");

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
    console.error("Error fetching user profile:", err.message);
    throw err;
  }
};

// Update user password by ID
const updateUserPassword = async (id, newHashedPassword) => {
  try {
    await pool.query('UPDATE "user" SET password = $1 WHERE id = $2', [
      newHashedPassword,
      id,
    ]);
    return true;
  } catch (err) {
    console.error("Error updating user password:", err.message);
    throw err;
  }
};

module.exports = { getUserProfile, updateUserPassword };
