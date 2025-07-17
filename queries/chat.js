// -----------------------------------------------------------------------------
// chat.js - Database queries for chat messaging
// -----------------------------------------------------------------------------
// Contains SQL/database logic for:
//   - Fetching chat messages
//   - Creating chats and sending messages
//
// Exports: Query functions for use in Express routes
// -----------------------------------------------------------------------------

const pool = require("../db.ts");
let chalk;
(async () => {
  chalk = (await import("chalk")).default;
})();

/**
 * Fetch all messages for a given chat.
 *
 * @param {number|string} chat_id - The chat's ID
 * @returns {Promise<Array|object>} List of messages or error object
 */
const getChatMessages = async (chat_id) => {
  try {
    // Query for all messages in the chat, including sender info
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
    // Log and return DB error
    console.error(chalk.red("Error fetching chat messages:"), err.message);
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
    console.error(chalk.red("Error fetching or creating chat:"), err.message);
    return { error: "Database error while fetching or creating chat." };
  }
};

// Send a message to a chat (group or direct)
const sendMessageToChat = async (chat_id, user_id, content) => {
  // Check if chat exists
  const chatResult = await pool.query(`SELECT * FROM chat WHERE id = $1`, [chat_id]);
  if (chatResult.rows.length === 0) {
    return { error: "Chat not found." };
  }
  // Check if user is a member of the chat
  const memberResult = await pool.query(`SELECT * FROM chat_member WHERE chat_id = $1 AND user_id = $2`, [chat_id, user_id]);
  if (memberResult.rows.length === 0) {
    return { error: "User is not a member of this chat." };
  }
  // Insert the message
  const insertResult = await pool.query(`INSERT INTO message (chat_id, user_id, content, sent_at) VALUES ($1, $2, $3, NOW()) RETURNING *`, [
    chat_id,
    user_id,
    content,
  ]);
  const message = insertResult.rows[0];
  // Get sender info
  const userResult = await pool.query(`SELECT first_name, last_name, profile_image FROM "user" WHERE id = $1`, [user_id]);
  const sender = userResult.rows[0];
  return {
    id: message.id,
    user_id: message.user_id,
    sender_name: sender ? `${sender.first_name} ${sender.last_name}` : "",
    profile_image: sender ? sender.profile_image : "",
    content: message.content,
    sent_at: message.sent_at,
  };
};

module.exports = {
  getChatMessages,
  getOrCreateChat,
  sendMessageToChat,
};
