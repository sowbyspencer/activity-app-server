// -----------------------------------------------------------------------------
// activityGroup.js - Express routes for activity group details
// -----------------------------------------------------------------------------
// Handles API endpoints for:
//   - Fetching group details for a specific activity
//
// Exports: Express router
// -----------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const { getActivityGroup } = require("../queries/activityGroup");

// Route: GET /activityGroup/:activity_id?user_id=<user_id>
// Fetches group details (members, last message, etc.) for a specific activity and user.
// Returns 400 if user_id is missing, 404 if no group found, or 200 with group info.
// Example: http://10.244.131.46:5000/activityGroup/2?user_id=1
router.get("/:activity_id", async (req, res) => {
  const { activity_id } = req.params;
  const { user_id } = req.query;
  console.log("[ACTIVITY GROUP] Fetching activity group for activity_id:", activity_id, "and user_id:", user_id);

  // Validate required query parameter
  if (!user_id) {
    console.warn("[ACTIVITY GROUP] Missing user_id in request");
    return res.status(400).json({ error: "Missing user_id parameter" });
  }

  try {
    // Call DB query to get group details for this activity and user
    const activityGroup = await getActivityGroup(activity_id, user_id);
    if (activityGroup.error) {
      // No group found for this activity
      console.warn("[ACTIVITY GROUP] No group found for activity_id:", activity_id);
      return res.status(404).json({ error: "No group found for this activity." });
    }
    // Success: return group details
    console.log("[ACTIVITY GROUP]  Fetched activity group for activity_id:", activity_id);
    res.json(activityGroup);
  } catch (err) {
    // Handle DB or server errors
    console.error("[ACTIVITY GROUP] Error fetching activity group:", err.message);
    res.status(500).json({
      error: "Failed to fetch activity group. Please try again later.",
    });
  }
});

// Export the router for use in the main server
module.exports = router;
