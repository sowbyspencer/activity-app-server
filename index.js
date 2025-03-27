require("dotenv").config();

const express = require("express");
const cors = require("cors");

const activitiesRoutes = require("./routes/activities");
const groupsRoutes = require("./routes/groups");
const activityGroupRoutes = require("./routes/activityGroup");
// const usersRoutes = require("./routes/users");
const chatRoutes = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 5000; // ✅ Use from .env

// Middleware
app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

// Routes
app.use("/activities", activitiesRoutes);
app.use("/groups", groupsRoutes);
app.use("/activityGroup", activityGroupRoutes);
// app.use("/users", usersRoutes);
app.use("/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(
    `✅ Server running at ${process.env.BASE_URL || "localhost"}:${PORT}`
  );
});
