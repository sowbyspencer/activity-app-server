const pool = require("../db.ts");

// Get matched activities for a specific user
const getMatchedActivities = async (user_id) => {
  const result = await pool.query(
    `
      SELECT 
        a.id AS activity_id, 
        a.name AS activity_name, 
        (SELECT image_url FROM activity_image WHERE activity_id = a.id LIMIT 1) AS activity_image
      FROM "swipe" s
      JOIN activity a ON s.activity_id = a.id
      WHERE s.user_id = $1 AND s.liked = TRUE
      ORDER BY a.id;
      `,
    [user_id]
  );
  return result.rows;
};

module.exports = { getMatchedActivities };
