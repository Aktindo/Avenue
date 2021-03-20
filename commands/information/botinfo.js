const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "botinfo",
  description: "Displays some information on the bot!",
  aliases: ["bi"],
  category: "Information",
  cooldown: 5,
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message) {
    const moment = require("moment");
    require("moment-duration-format");
    const duration = moment
      .duration(client.uptime)
      .format(" D [days], H [hours], m [minutes], s [seconds]");
    message.channel.send("Testing ping...").then(async (m) => {
      const embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle("Bot Information")
        .addField(
          "Users",
          `Currently serving **${client.users.cache.size}** gamers`,
          true
        )
        .addField(
          "Channels",
          `Monitoring **${client.channels.cache.size}** channels`,
          true
        )
        .addField(
          "Servers",
          `In **${client.guilds.cache.size}** server(s)`,
          true
        )
        .addField(
          "Support",
          "Here is a permanent link to join the [**support server**](https://discord.gg/xSQMdPEvHt)",
          false
        )
        .addField(
          "Invite",
          "If you want to use me in your server(s), click [**here**](https://discord.com/oauth2/authorize?client_id=790198442668064789&scope=bot&permissions=2113273591)",
          false
        )
        .addField(
          "Current ping",
          `Bot Evaluation Time - **${Math.round(
            (m.createdAt - message.createdAt) / client.ws.ping
          )}**ms\nBot Latency - **${Math.round(
            m.createdAt - message.createdAt
          )}**ms\nAPI Latency - **${Math.round(client.ws.ping)}**ms`,
          false
        )
        .addField("Uptime", duration, false)
        .setColor("BLURPLE");
      await m.edit(embed);
      m.edit("\u200b");
    });
  },
};
