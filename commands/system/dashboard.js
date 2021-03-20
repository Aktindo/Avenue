module.exports = {
  name: "dashboard",
  description: "The link to view the dashboard.",
  category: "System",
  cooldown: 5,
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message) {
    return message.channel.send(
      client.embedSuccess(
        message,
        "If you want to view the dashboard, you can click [here](https://avenue.aktindo.repl.co)"
      )
    );
  },
};
