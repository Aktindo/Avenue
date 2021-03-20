module.exports = {
  name: "roll",
  description: "Generates a random number from 1 to the number given.",
  category: "Miscellaneous",
  cooldown: 5,
  usage: "[number?number(default=10)]",
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message, args) {
    let number;
    if (!args[0]) number = 10;
    else number = parseInt(args[0]);
    const randomNumber = Math.floor(Math.random() * number);
    message.channel.send(
      client.embedSuccess(
        message,
        `You rolled \`${randomNumber}\` (1 - ${number}, ${(1 / number) * 100}%)`
      )
    );
  },
};
