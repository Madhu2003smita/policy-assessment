const ScheduledMessage = require("../models/ScheduledMessage");

const startScheduler = () => {
  console.log("Message scheduler started");

  setInterval(async () => {
    try {
      const now = new Date();

      const messages = await ScheduledMessage.find({
        status: "scheduled",
        scheduledAt: {
          $lte: now,
        },
      });

      for (const message of messages) {
        console.log(
          `[Scheduler] Processing message: ${message.message}`
        );

        message.status = "completed";

        await message.save();

        console.log(
          `[Scheduler] Message completed: ${message._id}`
        );
      }
    } catch (error) {
      console.error(
        "[Scheduler] Error:",
        error.message
      );
    }
  }, 1000);
};

module.exports = {
  startScheduler,
};