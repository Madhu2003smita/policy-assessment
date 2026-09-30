const ScheduledMessage = require("../models/ScheduledMessage");

const createScheduledMessage = async (req, res) => {
  try {
    const { message, day, time } = req.body;

    if (!message || !day || !time) {
      return res.status(400).json({
        success: false,
        message: "message, day and time are required",
      });
    }

   const scheduledAt = new Date(`${day}T${time}:00+05:30`);

    if (Number.isNaN(scheduledAt.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid day or time format",
      });
    }

    const scheduledMessage = await ScheduledMessage.create({
      message,
      scheduledAt,
    });

    return res.status(201).json({
      success: true,
      message: "Message scheduled successfully",
      data: scheduledMessage,
    });
  } catch (error) {
    console.error("Schedule message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to schedule message",
      error: error.message,
    });
  }
};

const getScheduledMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const scheduledMessage = await ScheduledMessage.findById(id);

    if (!scheduledMessage) {
      return res.status(404).json({
        success: false,
        message: "Scheduled message not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: scheduledMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get scheduled message",
      error: error.message,
    });
  }
};

module.exports = {
  createScheduledMessage,
  getScheduledMessage,
};
