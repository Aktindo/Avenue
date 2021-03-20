const mongoose = require("mongoose");

const reportSystemModel = mongoose.Schema({
  guildId: String,
  userId: String,
  caseNumber: Number,
  reportCaseNumber: Number,
  reporterId: String,
  reason: String,
  timestamp: Number,
});

module.exports = mongoose.model("guild-report-system-data", reportSystemModel);
