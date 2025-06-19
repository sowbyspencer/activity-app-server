const express = require("express");
const router = express.Router();
const { getChatMessages } = require("../queries/chat");
const pool = require("../db.ts");

// ✅ Get all messages for a chat
// Test URL: http://10.244.131.46:5000/chat/:chat_id (replace :chat_id with the chat ID)
// http://10.244.131.46:5000/chat/1
// Add detailed logging and responses for errors in chat routes
router.get("/:chat_id", async (req, res) => {
  const { chat_id } = req.params;
  console.log("[CHAT] Fetching messages for chat_id:", chat_id);

  try {
    const messages = await getChatMessages(chat_id);
    if (messages.error) {
      console.warn("[CHAT] No messages found for chat_id:", chat_id);
      return res.status(404).json({ error: "No messages found for this chat." });
    }
    console.log("[CHAT] Successfully fetched messages for chat_id:", chat_id);
    res.json(messages);
  } catch (err) {
    console.error("[CHAT] Error fetching messages for chat_id:", err.message);
    res.status(500).json({ error: "Failed to fetch messages. Please try again later." });
  }
});

// ✅ Create or fetch a chat
router.post("/create", async (req, res) => {
  const { chat_type, activity_id, user_ids } = req.body;
  console.log("[CHAT] Create or fetch chat with data:", {
    chat_type,
    activity_id,
    user_ids,
  });

  try {
    let chat;

    // Check if a chat already exists
    if (chat_type === "activity" && activity_id) {
      const result = await pool.query(`SELECT * FROM chat WHERE chat_type = $1 AND activity_id = $2`, [chat_type, activity_id]);
      chat = result.rows[0];
    } else if (chat_type === "direct" && user_ids.length === 2) {
      const result = await pool.query(
        `SELECT c.* FROM chat c
         JOIN chat_member cm1 ON c.id = cm1.chat_id
         JOIN chat_member cm2 ON c.id = cm2.chat_id
         WHERE c.chat_type = $1 AND cm1.user_id = $2 AND cm2.user_id = $3`,
        [chat_type, user_ids[0], user_ids[1]]
      );
      chat = result.rows[0];
    }

    // If no chat exists, create one
    if (!chat) {
      const chatResult = await pool.query(`INSERT INTO chat (chat_type, activity_id) VALUES ($1, $2) RETURNING *`, [chat_type, activity_id]);
      chat = chatResult.rows[0];

      // Add members to the chat
      for (const user_id of user_ids) {
        await pool.query(`INSERT INTO chat_member (chat_id, user_id) VALUES ($1, $2)`, [chat.id, user_id]);
      }

      console.log("[CHAT] New chat created with ID:", chat.id);
    } else {
      console.log("[CHAT] Existing chat found with ID:", chat.id);
    }

    res.json(chat);
  } catch (err) {
    console.error("[CHAT] Error creating or fetching chat:", err.message);
    res.status(500).json({ error: "Failed to create or fetch chat." });
  }
});

// ✅ Send a message to a chat (group or direct)
// POST /chat/:chat_id
router.post("/:chat_id", async (req, res) => {
  const { chat_id } = req.params;
  const { user_id, content } = req.body;
  if (!user_id || !content) {
    return res.status(400).json({ error: "Missing user_id or content." });
  }
  try {
    // Check if chat exists
    const chatResult = await pool.query(`SELECT * FROM chat WHERE id = $1`, [chat_id]);
    if (chatResult.rows.length === 0) {
      return res.status(404).json({ error: "Chat not found." });
    }
    // Check if user is a member of the chat
    const memberResult = await pool.query(`SELECT * FROM chat_member WHERE chat_id = $1 AND user_id = $2`, [chat_id, user_id]);
    if (memberResult.rows.length === 0) {
      return res.status(403).json({ error: "User is not a member of this chat." });
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
    res.json({
      id: message.id,
      user_id: message.user_id,
      sender_name: sender ? `${sender.first_name} ${sender.last_name}` : "",
      profile_image: sender ? sender.profile_image : "",
      content: message.content,
      sent_at: message.sent_at,
    });
  } catch (err) {
    console.error("[CHAT] Error sending message:", err.message);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

module.exports = router;
