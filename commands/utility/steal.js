const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "steal",
  description: "Adds an emoji to a server or gets the link of an emoji.",
  usage: "<add|get> <imageUrl?add(true)|emoji?get(true)>",
  category: "Utility",
  requiredPermissions: ["SEND_MESSAGES", "MANAGE_EMOJIS"],
  botPermissions: [
    "SEND_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "USE_EXTERNAL_EMOJIS",
  ],
  cooldown: 5,
  botOwnerOnly: false,
  /**
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args) {
    // ...
  },
};
