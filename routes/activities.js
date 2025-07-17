const express = require("express");
const router = express.Router();
let chalk;
(async () => {
  chalk = (await import("chalk")).default;
})();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getUnswipedActivities,
  recordSwipe,
  resetSwipes,
  createActivity,
  leaveActivity,
  getActivitiesByCreator,
  editActivity,
  deleteActivity,
} = require("../queries/activities");

// Configure multer for activity image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/activities"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Helper to get full URL for an uploaded file
function getFullImageUrl(req, filename) {
  const protocol = req.protocol;
  const host = req.get("host");
  return `${protocol}://${host}/images/activities/${filename}`;
}

// Route to get all activities or only unmatched activities for a user
// Test URL: http://10.244.131.46:5000/activities?user_id=1
router.get("/", async (req, res) => {
  const userId = req.query.user_id;
  const lat = req.query.lat ? parseFloat(req.query.lat) : undefined;
  const lon = req.query.lon ? parseFloat(req.query.lon) : undefined;
  const radius = req.query.radius ? parseFloat(req.query.radius) : undefined;
  if (!userId || lat === undefined || lon === undefined) {
    return res.status(400).json({ error: "Missing required user_id, lat, or lon query parameter." });
  }
  try {
    console.log(chalk.white(`[ACTIVITIES] Fetching unmatched activities for user_id: ${userId}, lat: ${lat}, lon: ${lon}, radius: ${radius}`));
    const activities = await getUnswipedActivities(userId, lat, lon, radius);
    console.log(chalk.green(`[ACTIVITIES]  Fetched unmatched activities for user_id: ${userId}`));
    res.json(activities);
  } catch (err) {
    console.error(chalk.red("[ACTIVITIES] Error fetching activities:"), err.message);
    res.status(500).json({ error: "Failed to fetch activities. Please try again later." });
  }
});

// Route to create a new activity
// POST /activities - Create a new activity
router.post("/", upload.array("images"), async (req, res) => {
  const {
    name,
    lat,
    lon,
    has_cost,
    cost,
    url,
    description,
    user_id,
    available_sun,
    available_mon,
    available_tue,
    available_wed,
    available_thu,
    available_fri,
    available_sat,
    address,
  } = req.body;

  // Convert types
  const parsedHasCost = has_cost === "true";
  const parsedUserId = parseInt(user_id, 10);
  const parsedLat = lat !== undefined && lat !== null && lat !== "" ? parseFloat(lat) : null;
  const parsedLon = lon !== undefined && lon !== null && lon !== "" ? parseFloat(lon) : null;
  const parsedAvailability = {
    available_sun: available_sun === "true",
    available_mon: available_mon === "true",
    available_tue: available_tue === "true",
    available_wed: available_wed === "true",
    available_thu: available_thu === "true",
    available_fri: available_fri === "true",
    available_sat: available_sat === "true",
  };

  // Validate request body
  if (
    !name ||
    // !location || // Removed: location is no longer required
    typeof parsedHasCost !== "boolean" ||
    isNaN(parsedUserId) ||
    Object.values(parsedAvailability).some((val) => typeof val !== "boolean")
  ) {
    console.log("[BACKEND] Validation failed for request body:", req.body);
    return res.status(400).json({
      error: "Missing or invalid required fields: name, has_cost, user_id, availability fields.",
    });
  }

  try {
    // Use IMAGE_PATH from .env for full URL
    const imagePaths = req.files.map((file) => `${process.env.IMAGE_PATH}/activities/${file.filename}`);

    console.log("[BACKEND] Creating a new activity with data:", {
      name,
      // location, // Removed
      lat: parsedLat,
      lon: parsedLon,
      has_cost: parsedHasCost,
      cost,
      url,
      description,
      user_id: parsedUserId,
      images: imagePaths,
      ...parsedAvailability,
      address,
    });

    const result = await createActivity({
      name,
      // location, // Removed
      lat: parsedLat,
      lon: parsedLon,
      has_cost: parsedHasCost,
      cost,
      url,
      description,
      user_id: parsedUserId,
      images: imagePaths,
      ...parsedAvailability,
      address,
    });

    console.log(chalk.green("[BACKEND] Activity created successfully:"), result);
    res.status(201).json(result);
  } catch (err) {
    console.error(chalk.red("[BACKEND] Error creating activity:"), err.message);
    res.status(400).json({ error: err.message });
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
    console.error(chalk.red("[ACTIVITIES] Error recording swipe:"), err.message);
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
    console.error(chalk.red("[ACTIVITIES] Error resetting swipes:"), err.message);
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
    console.error(chalk.red("[ACTIVITIES] Error leaving activity:"), err.message);
    res.status(500).json({ error: "Failed to leave activity. Please try again later." });
  }
});

// Route to get activities created by a specific user
router.get("/created", async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: "Missing required user_id query parameter." });
  }
  try {
    console.log(`[ACTIVITIES] Fetching activities created by user_id: ${userId}`);
    const activities = await getActivitiesByCreator(userId);
    console.log(chalk.green("[BACKEND] Activities fetched for user:"), userId);
    res.json(activities);
  } catch (err) {
    console.error(chalk.red("[ACTIVITIES] Error fetching activities by creator:"), err.message);
    res.status(500).json({ error: "Failed to fetch activities. Please try again later." });
  }
});

// Route to edit an existing activity
// PUT /activities/:id - Edit an existing activity
router.put("/:id", upload.array("images"), async (req, res) => {
  // Build updateFields object with only provided fields
  const updateFields = { id: req.params.id };
  const body = req.body;

  // List of fields to check
  const fieldList = [
    "name",
    // "location", // Removed legacy location field
    "lat",
    "lon",
    "has_cost",
    "cost",
    "url",
    "description",
    "user_id",
    "available_sun",
    "available_mon",
    "available_tue",
    "available_wed",
    "available_thu",
    "available_fri",
    "available_sat",
    "address",
  ];

  for (const field of fieldList) {
    if (body[field] !== undefined) {
      // Parse booleans and numbers as needed
      if (
        ["has_cost", "available_sun", "available_mon", "available_tue", "available_wed", "available_thu", "available_fri", "available_sat"].includes(
          field
        )
      ) {
        updateFields[field] = body[field] === "true";
      } else if (field === "user_id") {
        updateFields[field] = parseInt(body[field], 10);
      } else if (field === "lat" || field === "lon") {
        updateFields[field] = body[field] !== undefined && body[field] !== null && body[field] !== "" ? parseFloat(body[field]) : null;
      } else {
        updateFields[field] = body[field];
      }
    }
  }

  // Handle images if present
  // Use IMAGE_PATH from .env for full URL
  const imagePaths = req.files && req.files.length > 0 ? req.files.map((file) => `${process.env.IMAGE_PATH}/activities/${file.filename}`) : [];
  // Merge with existing images if provided
  let existingImages = [];
  if (body.existingImages) {
    if (Array.isArray(body.existingImages)) {
      existingImages = body.existingImages; // Keep full original path
    } else if (typeof body.existingImages === "string") {
      existingImages = [body.existingImages]; // Keep full original path
    }
  }
  if (imagePaths.length > 0 || existingImages.length > 0) {
    updateFields.images = [...existingImages, ...imagePaths];
  }

  try {
    console.log("[BACKEND] Editing activity with data:", updateFields);
    const result = await editActivity(updateFields);
    console.log(chalk.green("[BACKEND] Activity edited successfully:"), result);
    res.status(200).json(result);
  } catch (err) {
    console.error(chalk.red("[BACKEND] Error editing activity:"), err.message);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /activities/:id - Delete an activity and its images
router.delete("/:id", async (req, res) => {
  const activityId = req.params.id;
  try {
    const result = await deleteActivity(activityId);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(chalk.red("[BACKEND] Error deleting activity:"), err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
