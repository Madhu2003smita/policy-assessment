const { startCpuMonitor } = require("./src/services/cpuMonitor");
const { startScheduler } = require("./src/services/schedulerService");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./src/config/db");
const uploadRoutes = require("./src/routes/uploadRoutes");
const policyRoutes = require("./src/routes/policyRoutes");
const scheduledMessageRoutes = require("./src/routes/scheduledMessageRoutes");

// const cpuTestRoutes = require("./src/routes/cpuTestRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// Connect MongoDB
connectDB();

app.use("/api/upload", uploadRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/service", scheduledMessageRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Policy Assessment API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  startCpuMonitor();
   startScheduler();
});