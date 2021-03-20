const ms = require("ms");
require("dotenv").config();
module.exports = {
  name: "gstart",
  description: "Starts a giveaway in a channel.",
  category: "Utility",
  aliases: ["gcreate", "giveawaystart"],
  cooldown: 5,
  requiredPermissions: ["MANAGE_MESSAGES"],
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  usage:
    "<Channel?(ID|Mention)> <Duration?endsWith(s|m|h|d|w|m|y)> <Winners?number> <Prize>",
  async execute(client, message, args) {
    const giveawayChannel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);
    if (!giveawayChannel) {
      return message.channel.send(
        client.embedError(message, "Please provide a valid channel.")
      );
    }

    const giveawayDuration = args[1];
    if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
      return message.channel.send(
        client.embedError(message, "Please provide a valid duration.")
      );
    }

    const giveawayNumberWinners = args[2];
    if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
      return message.channel.send(
        client.embedError(message, "Please provide valid number of winners.")
      );
    }

    const giveawayPrize = args.slice(3).join(" ");
    if (!giveawayPrize) {
      return message.channel.send(
        client.embedError(message, "Please provide a valid prize.")
      );
    }

    client.giveawaysManager.start(giveawayChannel, {
      time: ms(giveawayDuration),
      prize: giveawayPrize,
      winnerCount: parseInt(giveawayNumberWinners),
      hostedBy: process.env.GIVEAWAY_EVERYONE_MENTION ? message.author : null,
      messages: {
        giveaway:
          (process.env.GIVEAWAY_EVERYONE_MENTION ? "@everyone\n\n" : "") +
          "🎉 **GIVEAWAY** 🎉",
        giveawayEnded:
          (process.env.GIVEAWAY_EVERYONE_MENTION ? "@everyone\n\n" : "") +
          "🎉 **GIVEAWAY ENDED** 🎉",
        timeRemaining: "Time remaining: **{duration}**!",
        inviteToParticipate: "React with 🎉 to participate!",
        winMessage:
          "🎉 Congratulations, {winners}! You won **{prize}**!\n{messageURL}",
        embedFooter: "Giveaways",
        noWinner: "Giveaway cancelled, no valid participations.",
        hostedBy: "Hosted by: {user}",
        winners: "winner(s)",
        endedAt: "Ended at",
        units: {
          seconds: "seconds",
          minutes: "minutes",
          hours: "hours",
          days: "days",
          pluralS: false,
        },
      },
    });

    message.channel.send(
      client.embedSuccess(
        message,
        `A giveaway has been started in ${giveawayChannel}!`
      )
    );
  },
};
