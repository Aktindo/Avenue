const someRandomCat = require("some-random-cat").Random;
module.exports = {
  name: "topic",
  description: "Get a random topic!",
  category: "Miscellaneous",
  cooldown: 5,
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message) {
    await someRandomCat
      .getTopic()
      .then((res) => {
        message.channel.send(
          client.embedSuccess(message, `Your new topic is - \`${res}\``)
        );
      })
      .catch((error) => {
        message.channel.send(
          client.embedError(message, `Error while fetching response:\n${error}`)
        );
      });
  },
};
