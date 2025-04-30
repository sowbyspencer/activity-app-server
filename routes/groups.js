const express = require("express");
const router = express.Router();
const { getMatchedActivities } = require("../queries/groups");

// Route to get matched activities for a user
// Test URL: http://10.244.131.46:5000/groups?user_id=<user_id>
// http://10.244.131.46:5000/groups?user_id=1
// Add detailed logging and responses for errors in groups routes
router.get("/", async (req, res) => {
  const { user_id } = req.query;
  console.log("[GROUPS] Fetching matched activities for user_id:", user_id);
  if (!user_id) {
    console.warn("[GROUPS] Missing user_id in request");
    return res.status(400).json({ error: "Missing user_id parameter" });
  }

  try {
    const matchedActivities = await getMatchedActivities(user_id);
    console.log(
      "[GROUPS] Successfully fetched matched activities for user_id:",
      user_id
    );
    res.json(matchedActivities);
  } catch (err) {
    console.error("[GROUPS] Error fetching matched activities:", err.message);
    res
      .status(500)
      .json({
        error: "Failed to fetch matched activities. Please try again later.",
      });
  }
});

module.exports = router;
