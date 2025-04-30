const pool = require("../db.ts");

// ✅ Get all messages for a chat
const getChatMessages = async (chat_id) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        m.id, 
        m.user_id, 
        u.first_name || ' ' || u.last_name AS sender_name,
        u.profile_image,
        m.content, 
        m.sent_at
      FROM message m
      JOIN "user" u ON m.user_id = u.id
      WHERE m.chat_id = $1
      ORDER BY m.sent_at DESC;
      `,
      [chat_id]
    );

    return result.rows;
  } catch (err) {
    console.error("Error fetching chat messages:", err.message);
    return { error: "Database error while fetching chat messages." };
  }
};

// ✅ Fetch or create a chat based on activity_id and user_id
const getOrCreateActivityChat = async (activity_id, user_id) => {
  try {
    // Check if a chat already exists
    const result = await pool.query(
      `SELECT * FROM chat WHERE chat_type = 'activity' AND activity_id = $1`,
      [activity_id]
    );

    let chat = result.rows[0];

    // If no chat exists, create one
    if (!chat) {
      const insertResult = await pool.query(
        `INSERT INTO chat (chat_type, activity_id) VALUES ('activity', $1) RETURNING *`,
        [activity_id]
      );
      chat = insertResult.rows[0];

      // Add the user to the chat
      await pool.query(
        `INSERT INTO chat_member (chat_id, user_id) VALUES ($1, $2)`,
        [chat.id, user_id]
      );
    }

    console.log("getOrCreateActivityChat: Returning chat_id:", chat.id); // Log the chat_id being returned
    return chat;
  } catch (err) {
    console.error("Error fetching or creating activity chat:", err.message);
    return {
      error: "Database error while fetching or creating activity chat.",
    };
  }
};

// ✅ Fetch or create a direct chat between two users
const getOrCreateDirectChat = async (user_id, other_user_id) => {
  try {
    // Check if a direct chat already exists
    const result = await pool.query(
      `SELECT c.* FROM chat c
       JOIN chat_member cm1 ON c.id = cm1.chat_id
       JOIN chat_member cm2 ON c.id = cm2.chat_id
       WHERE c.chat_type = 'direct' AND cm1.user_id = $1 AND cm2.user_id = $2`,
      [user_id, other_user_id]
    );

    let chat = result.rows[0];

    // If no chat exists, create one
    if (!chat) {
      const insertResult = await pool.query(
        `INSERT INTO chat (chat_type) VALUES ('direct') RETURNING *`
      );
      chat = insertResult.rows[0];

      // Add both users to the chat
      await pool.query(
        `INSERT INTO chat_member (chat_id, user_id) VALUES ($1, $2)`,
        [chat.id, user_id]
      );
      await pool.query(
        `INSERT INTO chat_member (chat_id, user_id) VALUES ($1, $2)`,
        [chat.id, other_user_id]
      );
    }

    console.log("getOrCreateDirectChat: Returning chat_id:", chat.id); // Log the chat_id being returned
    return chat;
  } catch (err) {
    console.error("Error fetching or creating direct chat:", err.message);
    return { error: "Database error while fetching or creating direct chat." };
  }
};

module.exports = {
  getChatMessages,
  getOrCreateActivityChat,
  getOrCreateDirectChat,
};
