// -----------------------------------------------------------------------------
// groups.js - Database queries for group activity matching
// -----------------------------------------------------------------------------
// Contains SQL/database logic for:
//   - Fetching matched activities for a user (group membership)
//
// Exports: Query functions for use in Express routes
// -----------------------------------------------------------------------------

const pool = require("../db.ts");
let chalk;
(async () => {
  chalk = (await import("chalk")).default;
})();

/**
 * Fetch all activities the user is a member of (matched activities).
 *
 * @param {number|string} user_id - The user's ID
 * @returns {Promise<Array>} List of matched activities
 */
const getMatchedActivities = async (user_id) => {
  try {
    // Query for all activities where the user is a member
    const result = await pool.query(
      `
        SELECT 
          a.id AS activity_id, 
          a.name AS activity_name, 
          (SELECT image_url FROM activity_image WHERE activity_id = a.id LIMIT 1) AS activity_image
        FROM activity_member am
        JOIN activity a ON am.activity_id = a.id
        WHERE am.user_id = $1
        ORDER BY a.id;
      `,
      [user_id]
    );
    return result.rows;
  } catch (err) {
    // Log and rethrow DB error
    console.error(chalk.red("Error fetching matched activities:"), err.message);
    throw err;
  }
};

// Export the query function for use in routes
module.exports = { getMatchedActivities };
