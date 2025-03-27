const express = require("express");
const router = express.Router();
const { getAllActivities } = require("../queries/activities");

// Route to get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await getAllActivities();
    res.json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
