const express = require("express");
const router = express.Router();
const { getChatMessages } = require("../queries/chat");

// ✅ Get all messages for a chat
// Test URL: http://10.244.131.46:5000/chat/:chat_id (replace :chat_id with the chat ID)
// http://10.244.131.46:5000/chat/1
router.get("/:chat_id", async (req, res) => {
  try {
    const chat_id = req.params.chat_id;
    const messages = await getChatMessages(chat_id);
    res.json(messages);
  } catch (err) {
    console.error("Error fetching chat messages:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
