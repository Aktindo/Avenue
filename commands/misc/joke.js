const { MessageEmbed } = require("discord.js");
const someRandomCat = require("some-random-cat").Random;
module.exports = {
  name: "joke",
  description: "Get a random joke!",
  category: "Miscellaneous",
  cooldown: 5,
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message) {
    await someRandomCat
      .getJoke()
      .then((res) => {
        message.channel.send(
          new MessageEmbed()
            .setTitle(res.title ? res.title : "")
            .setURL(res.url ? res.url : "")
            .setDescription(res.body ? res.body : "")
            .setColor("RANDOM")
        );
      })
      .catch((error) => {
        message.channel.send(
          client.embedError(
            message,
            `Error while fetching response:\n> ${error}`
          )
        );
      });
  },
};
