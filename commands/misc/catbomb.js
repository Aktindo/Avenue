const { Client, Message, MessageEmbed } = require("discord.js");
const someRandomCat = require("some-random-cat").Random;

module.exports = {
  name: "catbomb",
  description: "Gives **5** random images of cat! Like a message bomb",
  aliases: ["cb"],
  category: "Miscellaneous",
  permissionsByUser: ["SEND_MESSAGES"],
  permissionsByBot: [
    "SEND_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "USE_EXTERNAL_EMOJIS",
  ],
  cooldown: 15,
  botOwnerOnly: false,
  /**
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message) {
    let text = "";

    for (let i = 0; i < 5; i++) {
      const randomCat = await someRandomCat.getCat();
      text += `${randomCat}\n`;
    }

    message.channel.send(text);
  },
};
