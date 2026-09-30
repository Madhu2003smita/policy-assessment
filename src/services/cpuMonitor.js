const pidusage = require("pidusage");

const CPU_THRESHOLD = 70;
const CHECK_INTERVAL = 5000;
const MAX_HIGH_CPU_CHECKS = 3;

let highCpuCount = 0;

const startCpuMonitor = () => {
  console.log("CPU monitor started");
  console.log(`CPU threshold: ${CPU_THRESHOLD}%`);

  setInterval(async () => {
    try {
      const stats = await pidusage(process.pid);
      const cpuUsage = stats.cpu;

      console.log(
        `[CPU Monitor] CPU usage: ${cpuUsage.toFixed(2)}%`
      );

      if (cpuUsage >= CPU_THRESHOLD) {
        highCpuCount++;

        console.log(
          `[CPU Monitor] High CPU detected: ${highCpuCount}/${MAX_HIGH_CPU_CHECKS}`
        );

        if (highCpuCount >= MAX_HIGH_CPU_CHECKS) {
          console.log(
            `[CPU Monitor] CPU usage exceeded ${CPU_THRESHOLD}% for multiple checks`
          );

          console.log("[CPU Monitor] Restarting server...");

          await pidusage.clear();

          process.exit(1);
        }
      } else {
        highCpuCount = 0;
      }
    } catch (error) {
      console.error(
        "[CPU Monitor] Error:",
        error.message
      );
    }
  }, CHECK_INTERVAL);
};

module.exports = {
  startCpuMonitor,
};