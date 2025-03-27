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

module.exports = { getChatMessages };
