// Use the .env file to set environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Import routes
const activitiesRoutes = require("./routes/activities");
const groupsRoutes = require("./routes/groups");
const activityGroupRoutes = require("./routes/activityGroup");
const usersRoutes = require("./routes/users");
const chatRoutes = require("./routes/chat");

const app = express();
const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://activity-app-server.onrender.com",
    ], // Allow multiple origins
    methods: "GET,POST,PUT,DELETE", // Specify allowed HTTP methods
    credentials: true, // Allow cookies if needed
  })
);
app.use(express.json());
app.use("/public", express.static("public"));

// ✅ Attach routers (make sure they're imported correctly)
app.use("/activities", activitiesRoutes);
app.use("/groups", groupsRoutes);
app.use("/activityGroup", activityGroupRoutes);
app.use("/users", usersRoutes);
app.use("/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(
    `🔌 Connected to ${
      !process.env.DB_ENV || process.env.DB_ENV === "hosted"
        ? "Production DB"
        : "Local DB"
    }`
  );
});
