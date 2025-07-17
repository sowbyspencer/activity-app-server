// -----------------------------------------------------------------------------
// chat.js - Express routes for chat messaging
// -----------------------------------------------------------------------------
// Handles API endpoints for:
//   - Fetching chat messages
//   - Creating chats and sending messages
//
// Exports: Express router
// -----------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
let chalk;
(async () => {
  chalk = (await import("chalk")).default;
})();
const { getChatMessages, getOrCreateChat, sendMessageToChat } = require("../queries/chat");

// Route: GET /chat/:chat_id
// Fetches all messages for a given chat (by chat_id)
// Responds with 404 if no messages, 200 with messages otherwise
router.get("/:chat_id", async (req, res) => {
  const { chat_id } = req.params;
  console.log(chalk.white("[CHAT] Fetching messages for chat_id:"), chat_id);

  try {
    // Query DB for all messages in this chat
    const messages = await getChatMessages(chat_id);
    if (messages.error) {
      // No messages found for this chat
      console.warn(chalk.red("[CHAT] No messages found for chat_id:"), chat_id);
      return res.status(404).json({ error: "No messages found for this chat." });
    }
    // Success: return messages
    console.log(chalk.green("[CHAT]  Fetched messages for chat_id:"), chat_id);
    res.json(messages);
  } catch (err) {
    // Handle DB or server errors
    console.error(chalk.red("[CHAT] Error fetching messages for chat_id:"), err.message);
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
    const chat = await getOrCreateChat({ chat_type, activity_id, user_ids });
    if (chat.error) {
      return res.status(400).json({ error: chat.error });
    }
    res.json(chat);
  } catch (err) {
    console.error(chalk.red("[CHAT] Error creating or fetching chat:"), err.message);
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
    const result = await sendMessageToChat(chat_id, user_id, content);
    if (result.error) {
      if (result.error === "Chat not found.") {
        return res.status(404).json({ error: result.error });
      }
      if (result.error === "User is not a member of this chat.") {
        return res.status(403).json({ error: result.error });
      }
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    console.error(chalk.red("[CHAT] Error sending message:"), err.message);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

// Export the router for use in the main server
module.exports = router;
