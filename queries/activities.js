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
GROUP BY 
  a.id, a.name, a.description, a.location, a.has_cost, a.cost,
  a.available_sun, a.available_mon, a.available_tue, a.available_wed,
  a.available_thu, a.available_fri, a.available_sat, a.url
ORDER BY a.id;

  `);
  return result.rows;
};

// Get activities the user has NOT swiped on
const getUnswipedActivities = async (userId) => {
  const result = await pool.query(
    `
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
    WHERE a.id NOT IN (
      SELECT activity_id FROM swipe WHERE user_id = $1
    )
    GROUP BY 
      a.id, a.name, a.description, a.location, a.has_cost, a.cost,
      a.available_sun, a.available_mon, a.available_tue, a.available_wed,
      a.available_thu, a.available_fri, a.available_sat, a.url
    ORDER BY a.id;
  `,
    [userId]
  );
  return result.rows;
};

// Record a swipe (like/dislike) for a user on an activity
const recordSwipe = async (userId, activityId, liked) => {
  // liked: boolean (true = swipe up/like, false = swipe down/dislike)
  const result = await pool.query(
    `INSERT INTO swipe (user_id, activity_id, liked, swiped_at)
     VALUES ($1, $2, $3, NOW())
     RETURNING *;`,
    [userId, activityId, liked]
  );

  // If liked, add to activity_member if not already present
  if (liked) {
    await pool.query(
      `INSERT INTO activity_member (activity_id, user_id)
       SELECT $1, $2
       WHERE NOT EXISTS (
         SELECT 1 FROM activity_member WHERE activity_id = $1 AND user_id = $2
       );`,
      [activityId, userId]
    );
  }

  return result.rows[0];
};

// Reset swipes for a user (remove all their swipes except likes that are in activity_member)
const resetSwipes = async (userId) => {
  // Remove all swipes for this user EXCEPT those that are liked and have a matching activity_member
  await pool.query(
    `
    DELETE FROM swipe
    WHERE user_id = $1
      AND (liked = FALSE OR activity_id NOT IN (
        SELECT activity_id FROM activity_member WHERE user_id = $1
      ))
  `,
    [userId]
  );
};

// Export queries
module.exports = { getAllActivities, getUnswipedActivities, recordSwipe, resetSwipes };
