module.exports = {
  name: "newinv",
  description: "Generates a single-use permanent invite for the server.",
  category: "Utility",
  aliases: ["newinvite"],
  cooldown: 5,
  requiredPermissions: ["MANAGE_CHANNELS"],
  botPermissions: [
    "SEND_MESSAGES",
    "ATTACH_FILES",
    "USE_EXTERNAL_EMOJIS",
    "CREATE_INVITE",
  ],
  async execute(client, message) {
    message.channel
      .createInvite({
        maxAge: 0,
        maxUses: 1,
      })
      .then((invite) => {
        message.channel.send(
          client.embedSuccess(
            message,
            `Generated a permanent invite with the link \`https://discord.gg/${invite.code}\`.\n**Max Uses:** 1`
          )
        );
      })
      .catch(() => {
        message.channel.send(client.embedError(message, "Unexpected error."));
      });
  },
};
