const express = require("express");

const {
  createScheduledMessage,
  getScheduledMessage,
} = require("../controllers/scheduledMessageController");

const router = express.Router();

router.post("/", createScheduledMessage);
router.get("/:id", getScheduledMessage);

module.exports = router;