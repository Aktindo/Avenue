const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "uptime",
  description: "Tells you the uptime of the bot.",
  aliases: ["up"],
  category: "System",
  cooldown: 5,
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message) {
    const moment = require("moment");
    require("moment-duration-format");
    const duration = moment
      .duration(client.uptime)
      .format(" D [days], H [hours], m [minutes], s [seconds]");
    message.channel.send(
      new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle("Uptime")
        .setDescription(duration)
        .setColor(client.env.EMBED_NEUTRAL_COLOR)
    );
  },
};
