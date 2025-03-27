const express = require("express");
const router = express.Router();
const { getActivityGroup } = require("../queries/activityGroup");

router.get("/:activity_id", async (req, res) => {
  const { activity_id } = req.params;
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id" });
  }

  try {
    const activityGroup = await getActivityGroup(activity_id, user_id);
    res.json(activityGroup);
  } catch (err) {
    console.error("Error fetching activity group:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
