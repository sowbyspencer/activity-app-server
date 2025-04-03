const express = require("express");
const router = express.Router();
const { getAllActivities } = require("../queries/activities");

// Route to get all activities
// Test URL: http://10.244.131.46:5000/activities
// http://10.244.131.46:5000/activities
router.get("/", async (req, res) => {
  try {
    const activities = await getAllActivities();
    res.json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err.message);
    res.status(500).send("Server Error");
  }
});

// Route to create a new activity
router.post("/", async (req, res) => {
  const { name, location, has_cost, cost, url, description } = req.body;

  try {
    await pool.query(
      `INSERT INTO activity (name, location, has_cost, cost, url, description) VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, location, has_cost, cost, url, description]
    );
    res.status(201).json({ message: "Activity created successfully" });
  } catch (err) {
    console.error("Error creating activity:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
