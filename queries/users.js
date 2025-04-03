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

module.exports = { getUserProfile };
