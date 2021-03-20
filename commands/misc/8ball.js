const axios = require("axios").default;
module.exports = {
  name: "8ball",
  description: "Ask the magic 8ball!",
  usage: "<question>",
  category: "Miscellaneous",
  cooldown: 5,
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message, args) {
    const question = args.join(" ");
    if (!question) {
      return message.channel.send(
        client.embedError(message, "Please provide a question.")
      );
    }
    axios
      .get(`https://8ball.delegator.com/magic/JSON/${question}`)
      .then((res) => {
        const answer = res.data.magic.answer;
        message.channel.send(`🎱 ${answer}`);
      })
      .catch((e) => {
        message.channel.send(
          client.embedError(message, `Error while fetching response:\n${e}`)
        );
      });
  },
};
