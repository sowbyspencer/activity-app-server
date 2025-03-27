const pool = require("../db.ts");

// Get all activities
const getAllActivities = async () => {
  const result = await pool.query(`
    SELECT 
      a.id, 
      a.name, 
      a.description,
      a.location, 
      a.has_cost, 
      a.cost, 
      a.available_sun, 
      a.available_mon, 
      a.available_tue, 
      a.available_wed, 
      a.available_thu, 
      a.available_fri, 
      a.available_sat,
      a.url,
      COALESCE(json_agg(ai.image_url) FILTER (WHERE ai.image_url IS NOT NULL), '[]') AS images
    FROM activity a
    LEFT JOIN activity_image ai ON a.id = ai.activity_id
    GROUP BY a.id
    ORDER BY a.id;
  `);
  return result.rows;
};

// Export queries
module.exports = { getAllActivities };
