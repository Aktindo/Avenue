const { Client, Message, MessageEmbed } = require("discord.js");
const someRandomCat = require("some-random-cat").Random;
module.exports = {
  name: "dogbomb",
  description: "Gives you 5 random pictures of dogs!",
  aliases: ["doggobomb"],
  category: "Miscellaneous",
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
    let text = "";

    for (let i = 0; i < 5; i++) {
      const randomCat = await someRandomCat.getDog();
      text += `${randomCat}\n`;
    }

    message.channel.send(text);
  },
};
