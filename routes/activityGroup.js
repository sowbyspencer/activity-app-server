const express = require("express");
const router = express.Router();
const { getActivityGroup } = require("../queries/activityGroup");

// Test URL: http://10.244.131.46:5000/activityGroup/:activity_id?user_id=<user_id>
// http://10.244.131.46:5000/activityGroup/2?user_id=1
// Replace :activity_id with the activity ID and <user_id> with the user ID
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
