const mongoose = require("mongoose");

const messageCountModel = mongoose.Schema({
  guildId: String,
  userId: String,
  messageCount: Number,
});

module.exports = mongoose.model(
  "guild-user-messagecount-data",
  messageCountModel
);
