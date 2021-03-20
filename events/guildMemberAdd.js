const guildChannelsModel = require("../models/guild-channels-model");
const guildWelcomeModel = require("../models/guild-welcome-model");
const logs = require("../models/logs");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    await logs.add(member.guild.id, "joins");
    const channelData = await guildChannelsModel.findOne({
      guildId: member.guild.id,
    });
    if (!channelData) return;
    const welcomeData = await guildWelcomeModel.findOne({
      guildId: member.guild.id,
    });
    if (!welcomeData) return;
    const channel = member.guild.channels.cache.get(channelData.welcomeChannel);
    if (!channel) return;
    let text = welcomeData.text;
    if (!text) return;
    const variables = {
      "{user}": member,
      "{server}": member.guild.name,
      "{membercount}": member.guild.memberCount,
    };
    text = text.replace(/{user}|{server}|{membercount}/gi, function (matched) {
      return variables[matched];
    });
    await channel.send(text);
  },
};
