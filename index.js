const express = require("express");
const cors = require("cors");

// Import routes
const activitiesRoutes = require("./routes/activities");
const groupsRoutes = require("./routes/groups");
const activityGroupRoutes = require("./routes/activityGroup");
// const usersRoutes = require("./routes/users");
const chatRoutes = require("./routes/chat");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

// ✅ Attach routers (make sure they're imported correctly)
app.use("/activities", activitiesRoutes);
app.use("/groups", groupsRoutes);
app.use("/activityGroup", activityGroupRoutes);
// app.use("/users", usersRoutes);
app.use("/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
