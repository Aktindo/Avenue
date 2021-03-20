const logs = require("../models/logs");
module.exports = {
  name: "guildMemberRemove",
  once: false,
  async execute(member) {
    await logs.add(member.guild.id, "leaves");
  },
};
