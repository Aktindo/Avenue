const mongoose = require("mongoose");

const userLogsSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  cases: [Object],
});

module.exports = mongoose.model("user-logs-data", userLogsSchema);
