const pool = require("../db.ts");
const { getOrCreateChat } = require("./chat");

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

  let addedToActivityMember = false;
  let directChats = [];

  // If liked, add to activity_member if not already present
  if (liked) {
    const activityMemberRes = await pool.query(
      `INSERT INTO activity_member (activity_id, user_id)
       SELECT $1, $2
       WHERE NOT EXISTS (
         SELECT 1 FROM activity_member WHERE activity_id = $1 AND user_id = $2
       )
       RETURNING *;`,
      [activityId, userId]
    );
    addedToActivityMember = activityMemberRes.rows.length > 0;

    // --- NEW LOGIC: Create direct chats with all other members ---
    // Get all other user IDs in this activity (excluding the new member)
    // --- NEW LOGIC: Add user to group chat (activity chat) as well ---
    await getOrCreateChat({
      chat_type: "activity",
      activity_id: activityId,
      user_ids: [userId],
    });
    // --- existing direct chat logic ---
    const otherMembersRes = await pool.query(`SELECT user_id FROM activity_member WHERE activity_id = $1 AND user_id != $2`, [activityId, userId]);
    const otherUserIds = otherMembersRes.rows.map((row) => row.user_id);
    for (const otherUserId of otherUserIds) {
      // Create or fetch direct chat between userId and otherUserId
      const chat = await getOrCreateChat({
        chat_type: "direct",
        user_ids: [userId, otherUserId],
      });
      directChats.push({
        chat_id: chat.id,
        user_ids: [userId, otherUserId],
        created: chat.created_at ? true : false,
      });
    }
  }

  return {
    swipe: result.rows[0],
    addedToActivityMember,
    directChats,
  };
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

// Create a new activity
const createActivity = async ({ name, location, has_cost, cost, url, description, user_id, images }) => {
  // Validate cost field
  const validatedCost = cost === "" || cost === null ? null : parseFloat(cost);
  if (validatedCost !== null && isNaN(validatedCost)) {
    throw new Error("Invalid cost value. Must be a number or null.");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert activity
    const activityResult = await client.query(
      `INSERT INTO activity (name, location, has_cost, cost, url, description, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *;`,
      [name, location, has_cost, validatedCost, url, description, user_id]
    );

    const activityId = activityResult.rows[0].id;

    // Insert images
    if (images && images.length > 0) {
      const imageQueries = images.map((imageUrl) => {
        return client.query(
          `INSERT INTO activity_image (activity_id, image_url)
           VALUES ($1, $2);`,
          [activityId, imageUrl]
        );
      });
      await Promise.all(imageQueries);
    }

    await client.query("COMMIT");
    return activityResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Leave or unlike an activity: remove from activity_member, group chat, and direct chats if no other shared activities
const leaveActivity = async (userId, activityId) => {
  // Remove from activity_member
  await pool.query(`DELETE FROM activity_member WHERE user_id = $1 AND activity_id = $2`, [userId, activityId]);

  // Reset swipe entries for this user and activity
  await pool.query(`DELETE FROM swipe WHERE user_id = $1 AND activity_id = $2`, [userId, activityId]);

  // Remove from group chat (activity chat)
  const groupChatRes = await pool.query(`SELECT id FROM chat WHERE chat_type = 'activity' AND activity_id = $1`, [activityId]);
  if (groupChatRes.rows.length > 0) {
    const groupChatId = groupChatRes.rows[0].id;
    await pool.query(`DELETE FROM chat_member WHERE chat_id = $1 AND user_id = $2`, [groupChatId, userId]);
    // Delete messages from this user in the activity chat
    await pool.query(`DELETE FROM message WHERE chat_id = $1 AND user_id = $2`, [groupChatId, userId]);
  }

  // Remove from direct chats if no other shared activities
  const otherUsersRes = await pool.query(`SELECT user_id FROM activity_member WHERE activity_id = $1 AND user_id != $2`, [activityId, userId]);
  const otherUserIds = otherUsersRes.rows.map((row) => row.user_id);
  for (const otherUserId of otherUserIds) {
    // Check if user and otherUserId share any other activities
    const sharedRes = await pool.query(
      `SELECT 1 FROM activity_member WHERE user_id = $1 AND activity_id IN (
        SELECT activity_id FROM activity_member WHERE user_id = $2
      ) AND activity_id != $3 LIMIT 1`,
      [userId, otherUserId, activityId]
    );
    if (sharedRes.rows.length === 0) {
      // No other shared activities, delete direct chat
      const chatRes = await pool.query(
        `SELECT c.id FROM chat c
         JOIN chat_member cm1 ON c.id = cm1.chat_id
         JOIN chat_member cm2 ON c.id = cm2.chat_id
         WHERE c.chat_type = 'direct' AND cm1.user_id = $1 AND cm2.user_id = $2`,
        [userId, otherUserId]
      );
      if (chatRes.rows.length > 0) {
        const chatId = chatRes.rows[0].id;
        // Remove both users from chat_member
        await pool.query(`DELETE FROM chat_member WHERE chat_id = $1 AND (user_id = $2 OR user_id = $3)`, [chatId, userId, otherUserId]);
        // Optionally, delete the chat if no members left
        await pool.query(`DELETE FROM chat WHERE id = $1 AND NOT EXISTS (SELECT 1 FROM chat_member WHERE chat_id = $1)`, [chatId]);
        // Delete messages from both users in this direct chat
        await pool.query(`DELETE FROM message WHERE chat_id = $1 AND (user_id = $2 OR user_id = $3)`, [chatId, userId, otherUserId]);
      }
    }
  }
  return { success: true };
};

// Get activities created by a specific user
const getActivitiesByCreator = async (userId) => {
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
    WHERE a.user_id = $1
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

module.exports = {
  getAllActivities,
  getUnswipedActivities,
  recordSwipe,
  resetSwipes,
  createActivity,
  leaveActivity,
  getActivitiesByCreator,
};
