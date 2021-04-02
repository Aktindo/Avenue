const guildChannelsModel = require("../models/guild-channels-model");
const guildWelcomeModel = require("../models/guild-welcome-model");

module.exports = {
  name: "welcome",
  enabled: true,
  async execute(client) {
    let welcomeChannel, welcomeText;

    client.on("message", async (message) => {
      const channelData = await guildChannelsModel.findOne({
        guildId: message.guild.id,
      });
      const welcomeData = await guildWelcomeModel.findOne({
        guildId: message.guild.id,
      });

      channelData && channelData.welcomeChannel
        ? (welcomeChannel = message.guild.channels.cache.get(
            channelData.welcomeChannel
          ))
        : (welcomeChannel = null);

      welcomeData && welcomeData.text
        ? (welcomeText = welcomeData.text)
        : (welcomeText = null);
    });

    client.on("guildMemberAdd", (member) => {
      if (welcomeChannel) {
        welcomeChannel.send(
          welcomeText
            .replace("{user(mention)}", `<@${member.id}>`)
            .replace("{user(name)}", member.displayName)
            .replace("{user(tag)}", member.user.tag)
            .replace("{server(name)}", member.guild.name)
            .replace("{server(id)}", member.guild.id)
            .replace("{server(membercount)}", member.guild.memberCount)
        );
      }
    });
  },
};
