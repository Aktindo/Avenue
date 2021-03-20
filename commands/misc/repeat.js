module.exports = {
  name: "repeat",
  aliases: ["say"],
  usage: "<text>",
  description: "Repeats what you say.",
  category: "Miscellaneous",
  cooldown: 5,
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message, args) {
    if (!args.length) {
      return message.channel.send(
        client.embedError(message, "Please provide some text to repeat!")
      );
    }
    await message.delete();
    message.channel.send(args.join(" "));
  },
};
