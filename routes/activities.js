const express = require("express");
const router = express.Router();
const { getUnswipedActivities } = require("../queries/activities");

// Route to get all activities or only unmatched activities for a user
// Test URL: http://10.244.131.46:5000/activities?user_id=1
router.get("/", async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: "Missing required user_id query parameter." });
  }
  try {
    console.log(`[ACTIVITIES] Fetching unmatched activities for user_id: ${userId}`);
    const activities = await getUnswipedActivities(userId);
    res.json(activities);
  } catch (err) {
    console.error("[ACTIVITIES] Error fetching activities:", err.message);
    res.status(500).json({ error: "Failed to fetch activities. Please try again later." });
  }
});

// Route to create a new activity
router.post("/", async (req, res) => {
  const { name, location, has_cost, cost, url, description } = req.body;
  console.log("[ACTIVITIES] Creating a new activity with data:", {
    name,
    location,
    has_cost,
    cost,
    url,
    description,
  });
  try {
    await pool.query(`INSERT INTO activity (name, location, has_cost, cost, url, description) VALUES ($1, $2, $3, $4, $5, $6)`, [
      name,
      location,
      has_cost,
      cost,
      url,
      description,
    ]);
    console.log("[ACTIVITIES] Activity created successfully");
    res.status(201).json({ message: "Activity created successfully" });
  } catch (err) {
    console.error("[ACTIVITIES] Error creating activity:", err.message);
    res.status(500).json({ error: "Failed to create activity. Please try again later." });
  }
});

module.exports = router;
