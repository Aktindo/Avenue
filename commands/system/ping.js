const { MessageEmbed } = require("discord.js");
const { colors } = require("../../models/data/colors.json");
const guildCasesModel = require("../../models/guild-cases-model");
module.exports = {
  name: "ping",
  description: "A command to test the latency of the bot.",
  category: "System",
  cooldown: 5,
  aliases: ["p"],
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message) {
    message.channel.send("Testing ping...").then(async (m) => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const dataPing = Date.now();
      await guildCasesModel.findOne({
        guildId: message.guild.id,
      });
      const dataPingNow = Date.now();
      const dataRealPing = dataPingNow - dataPing;
      const embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle("🏓 Pong!")
        .setDescription(
          `Bot Evaluation Time - **${Math.round(
            (m.createdAt - message.createdAt) / client.ws.ping
          )}**ms \nBot Latency - **${Math.round(
            m.createdAt - message.createdAt
          )}**ms \nAPI Latency - **${Math.round(
            client.ws.ping
          )}**ms\nDatabase Latency - **${dataRealPing}**ms`
        )
        .setColor(randomColor);
      m.edit(embed);
      m.edit("\u200b");
    });
  },
};
