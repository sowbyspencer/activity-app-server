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

// Unified function to fetch or create a chat (group or direct)
// Pass { chat_type: 'activity', activity_id, user_ids: [user_id] } for group
// Pass { chat_type: 'direct', user_ids: [user_id, other_user_id] } for direct
const getOrCreateChat = async ({ chat_type, activity_id, user_ids }) => {
  try {
    let chat;
    if (chat_type === "activity" && activity_id) {
      // Check if group chat exists
      const result = await pool.query(`SELECT * FROM chat WHERE chat_type = 'activity' AND activity_id = $1`, [activity_id]);
      chat = result.rows[0];
      if (!chat) {
        const insertResult = await pool.query(`INSERT INTO chat (chat_type, activity_id) VALUES ('activity', $1) RETURNING *`, [activity_id]);
        chat = insertResult.rows[0];
      }
      // Add all users to chat_member (usually just one)
      for (const user_id of user_ids) {
        await pool.query(
          `INSERT INTO chat_member (chat_id, user_id)
           SELECT $1, $2 WHERE NOT EXISTS (
             SELECT 1 FROM chat_member WHERE chat_id = $1 AND user_id = $2
           )`,
          [chat.id, user_id]
        );
      }
    } else if (chat_type === "direct" && user_ids.length === 2) {
      // Check if direct chat exists
      const result = await pool.query(
        `SELECT c.* FROM chat c
         JOIN chat_member cm1 ON c.id = cm1.chat_id
         JOIN chat_member cm2 ON c.id = cm2.chat_id
         WHERE c.chat_type = 'direct' AND cm1.user_id = $1 AND cm2.user_id = $2`,
        [user_ids[0], user_ids[1]]
      );
      chat = result.rows[0];
      if (!chat) {
        const insertResult = await pool.query(`INSERT INTO chat (chat_type) VALUES ('direct') RETURNING *`);
        chat = insertResult.rows[0];
      }
      // Add both users to chat_member
      for (const user_id of user_ids) {
        await pool.query(
          `INSERT INTO chat_member (chat_id, user_id)
           SELECT $1, $2 WHERE NOT EXISTS (
             SELECT 1 FROM chat_member WHERE chat_id = $1 AND user_id = $2
           )`,
          [chat.id, user_id]
        );
      }
    } else {
      throw new Error("Invalid chat_type or parameters");
    }
    return chat;
  } catch (err) {
    console.error("Error fetching or creating chat:", err.message);
    return { error: "Database error while fetching or creating chat." };
  }
};

module.exports = {
  getChatMessages,
  getOrCreateChat,
};
