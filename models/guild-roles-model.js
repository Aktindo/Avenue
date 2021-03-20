const mongoose = require("mongoose");

const guildRoleModel = mongoose.Schema({
  guildId: String,
  mutedRole: String,
});

module.exports = mongoose.model("guild-roles-data", guildRoleModel);
