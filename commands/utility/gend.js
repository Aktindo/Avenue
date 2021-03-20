module.exports = {
  name: "gend",
  description: "Ends a giveaway in a channel.",
  category: "Utility",
  aliases: ["gdestroy", "giveawayend"],
  cooldown: 5,
  requiredPermissions: ["MANAGE_MESSAGES"],
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  usage: "<MessageID>",
  async execute(client, message, args) {
    if (!args[0]) {
      return message.channel.send(
        client.embedError(
          message,
          "Please provide a valid giveaway message ID."
        )
      );
    }
    const giveaway =
      client.giveawaysManager.giveaways.find(
        (g) => g.prize === args.join(" ")
      ) ||
      client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    if (!giveaway) {
      return message.channel.send(
        client.embedError(
          message,
          `No giveaway found with the ID - \`${args.join(" ")}\`.`
        )
      );
    }

    client.giveawaysManager
      .edit(giveaway.messageID, {
        setEndTimestamp: Date.now(),
      })

      .then(() => {
        message.channel.send(
          "Ending the giveaway in less than " +
            client.giveawaysManager.options.updateCountdownEvery / 1000 +
            " seconds..."
        );
      })
      .catch((e) => {
        if (
          e.startsWith(
            `Giveaway with message ID ${giveaway.messageID} is already ended.`
          )
        ) {
          message.channel.send(
            client.embedError(message, "That giveaway is already ended.")
          );
        } else {
          console.error(e);
          message.channel.send(
            client.embedError(
              message,
              "Failed to end the giveaway. Please report this error."
            )
          );
        }
      });
  },
};
