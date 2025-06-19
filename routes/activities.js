const express = require("express");
const router = express.Router();
const { getUnswipedActivities, recordSwipe, resetSwipes, createActivity, leaveActivity } = require("../queries/activities");

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
    const result = await createActivity({ name, location, has_cost, cost, url, description });
    res.status(201).json(result);
  } catch (err) {
    console.error("[ACTIVITIES] Error creating activity:", err.message);
    res.status(500).json({ error: "Failed to create activity. Please try again later." });
  }
});

// POST /activities/swipe - Record a swipe action
router.post("/swipe", async (req, res) => {
  const { userId, activityId, liked } = req.body;
  if (!userId || !activityId || typeof liked !== "boolean") {
    return res.status(400).json({ error: "Missing or invalid userId, activityId, or liked (boolean) in request body." });
  }
  try {
    const result = await recordSwipe(userId, activityId, liked);
    res.status(201).json({
      message: "Swipe recorded",
      swipe: result.swipe,
      addedToActivityMember: result.addedToActivityMember,
      directChats: result.directChats,
    });
  } catch (err) {
    console.error("[ACTIVITIES] Error recording swipe:", err.message);
    res.status(500).json({ error: "Failed to record swipe. Please try again later." });
  }
});

// POST /activities/reset-swipes - Reset declined swipes for a user
router.post("/reset-swipes", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId in request body." });
  }
  try {
    await resetSwipes(userId);
    res.status(200).json({ message: "Declined activities have been reset." });
  } catch (err) {
    console.error("[ACTIVITIES] Error resetting swipes:", err.message);
    res.status(500).json({ error: "Failed to reset declined activities." });
  }
});

// POST /activities/leave - Leave or unlike an activity
router.post("/leave", async (req, res) => {
  const { userId, activityId } = req.body;
  if (!userId || !activityId) {
    return res.status(400).json({ error: "Missing userId or activityId in request body." });
  }
  try {
    const result = await leaveActivity(userId, activityId);
    res.status(200).json({ message: "Left activity successfully.", result });
  } catch (err) {
    console.error("[ACTIVITIES] Error leaving activity:", err.message);
    res.status(500).json({ error: "Failed to leave activity. Please try again later." });
  }
});

module.exports = router;
