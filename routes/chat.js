const express = require("express");
const router = express.Router();
const { getChatMessages } = require("../queries/chat");

// ✅ Get all messages for a chat
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
