require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const frontendRoutes = require("./routes/frontendRoutes");

const app = express();

// DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// 👇 IMPORTANT: serve frontend files
app.use(express.static(path.join(__dirname, "frontend")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/", frontendRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});