const express = require("express");
const router = express.Router();
const { getActivityGroup } = require("../queries/activityGroup");

// Test URL: http://10.244.131.46:5000/activityGroup/:activity_id?user_id=<user_id>
// http://10.244.131.46:5000/activityGroup/2?user_id=1
// Replace :activity_id with the activity ID and <user_id> with the user ID
router.get("/:activity_id", async (req, res) => {
  const { activity_id } = req.params;
  const { user_id } = req.query;
  console.log(
    "[ACTIVITY GROUP] Fetching activity group for activity_id:",
    activity_id,
    "and user_id:",
    user_id
  );

  if (!user_id) {
    console.warn("[ACTIVITY GROUP] Missing user_id in request");
    return res.status(400).json({ error: "Missing user_id parameter" });
  }

  try {
    const activityGroup = await getActivityGroup(activity_id, user_id);
    if (activityGroup.error) {
      console.warn(
        "[ACTIVITY GROUP] No group found for activity_id:",
        activity_id
      );
      return res
        .status(404)
        .json({ error: "No group found for this activity." });
    }
    console.log(
      "[ACTIVITY GROUP] Successfully fetched activity group for activity_id:",
      activity_id
    );
    res.json(activityGroup);
  } catch (err) {
    console.error(
      "[ACTIVITY GROUP] Error fetching activity group:",
      err.message
    );
    res
      .status(500)
      .json({
        error: "Failed to fetch activity group. Please try again later.",
      });
  }
});

module.exports = router;
