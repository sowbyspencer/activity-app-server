const express = require("express");
const router = express.Router();
const { getMatchedActivities } = require("../queries/groups");

// Route to get matched activities for a user
// Test URL: http://10.244.131.46:5000/groups?user_id=<user_id>
// http://10.244.131.46:5000/groups?user_id=1
router.get("/", async (req, res) => {
  const user_id = req.query.user_id; // Extract user_id from request query

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const matchedGroups = await getMatchedActivities(user_id);
    res.json(matchedGroups);
  } catch (err) {
    console.error("Error fetching activities:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
