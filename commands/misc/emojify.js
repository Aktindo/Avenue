const { Client, Message, MessageEmbed } = require("discord.js");
const emojiy = require("discord-emoji-convert");
module.exports = {
  name: "emojify",
  description: "Emojifies a text!",
  aliases: [""],
  usage: "",
  category: "",
  requiredPermissions: ["SEND_MESSAGES"],
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
    const text = args.join(" ");
    if (!text) {
      return message.channel.send(
        client.embedError(message, "Please provide some valid text!")
      );
    } else if (text.length > 20) {
      return message.channel.send(
        client.embedError(
          message,
          "Please provide some text with not more than 20 characters."
        )
      );
    }

    message.channel.send(emojiy.convert(text));
  },
};
