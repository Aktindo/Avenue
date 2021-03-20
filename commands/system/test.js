module.exports = {
  name: "test",
  description: "Tests a temporary command.",
  category: "System",
  cooldown: 5,
  botOwnerOnly: true,
  guildOnly: true,
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message) {
    message.channel.send("Hi");
  },
};
