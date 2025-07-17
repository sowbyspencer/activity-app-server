// -----------------------------------------------------------------------------
// groups.js - Express routes for group activity matching
// -----------------------------------------------------------------------------
// Handles API endpoints for:
//   - Fetching matched activities for a user (group membership)
//
// Exports: Express router
// -----------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
let chalk;
(async () => {
  chalk = (await import("chalk")).default;
})();
const { getMatchedActivities } = require("../queries/groups");

// Route: GET /groups?user_id=<user_id>
// Returns all activities the user is a member of (matched activities)
// Responds with 400 if user_id is missing, 200 with activities otherwise
router.get("/", async (req, res) => {
  const { user_id } = req.query;
  console.log(chalk.white("[GROUPS] Fetching matched activities for user_id:"), user_id);
  if (!user_id) {
    // Missing required user_id
    console.warn(chalk.red("[GROUPS] Missing user_id in request"));
    return res.status(400).json({ error: "Missing user_id parameter" });
  }

  try {
    // Query DB for matched activities
    const matchedActivities = await getMatchedActivities(user_id);
    console.log(chalk.green("[GROUPS]  Fetched matched activities for user_id:"), user_id);
    res.json(matchedActivities);
  } catch (err) {
    // Handle DB or server errors
    console.error(chalk.red("[GROUPS] Error fetching matched activities:"), err.message);
    res.status(500).json({
      error: "Failed to fetch matched activities. Please try again later.",
    });
  }
});

// Export the router for use in the main server
module.exports = router;
