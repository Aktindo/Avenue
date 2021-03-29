const { MessageEmbed } = require("discord.js");
const guildCasesModel = require("../../models/guild-cases-model");
const guildChannelsModel = require("../../models/guild-channels-model");
const userLogsModel = require("../../models/user-logs-model");
module.exports = {
  name: "warn",
  description: "Warns a user with a reason (if any)",
  category: "Moderation",
  cooldown: 5,
  requiredPermissions: ["MANAGE_ROLES"],
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  usage: "<user> [reason]",
  async execute(client, message, args) {
    const target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!target) {
      return message.channel.send(
        client.embedError(message, "Please mention a valid user to warn.")
      );
    }

    if (target.id === message.author.id) {
      return message.channel.send(
        client.embedError(message, "You cannot warn yourself.")
      );
    }

    if (target.user.bot) {
      return message.channel.send(
        client.embedError(message, "You cannot warn bots.")
      );
    }

    if (target.hasPermission("MANAGE_MESSAGES")) {
      return message.channel.send(
        client.embedError(message, "You cannot warn a moderator/administrator.")
      );
    }

    let reason = args.slice(1).join(" ");
    if (reason.length > 1024) {
      return message.channel.send(
        client.embedError(
          message,
          "Please provide a reason less than 1024 characters."
        )
      );
    }
    if (!reason) reason = "Not specified";

    const loadingMessage = await message.channel.send(
      new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`Warning ${target}... Please wait!`)
        .setColor(client.env.EMBED_NEUTRAL_COLOR)
    );

    const cases = await guildCasesModel.findOneAndUpdate(
      {
        guildId: message.guild.id,
      },
      {
        $inc: {
          totalCases: 1,
          warnCases: 1,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    const warning = {
      caseNumber: cases.totalCases,
      warnCaseNumber: cases.warnCases,
      type: "Warn",
      moderatorId: message.author.id,
      reason,
      timeStamp: new Date(),
    };
    await userLogsModel.findOneAndUpdate(
      {
        _id: message.guild.id,
        userId: target.id,
      },
      {
        _id: message.guild.id,
        userId: target.id,
        $push: {
          cases: warning,
        },
      },
      {
        upsert: true,
      }
    );

    target
      .send(
        new MessageEmbed()
          .setAuthor(target.user.username, target.user.displayAvatarURL())
          .setTimestamp()
          .setTitle(`You have been warned in ${message.guild.name}`)
          .addField("Case Number", cases.totalCases, false)
          .addField("Moderator", message.author.tag, false)
          .addField("Reason", reason, false)
          .setColor("YELLOW")
          .setFooter(`Sent from ${message.guild.name}`, message.guild.iconURL())
      )
      .catch(() =>
        message.channel.send(
          message.channel.send(
            client.embedSuccess(
              message,
              `Warning logged for ${target}... An error occured.`
            )
          )
        )
      );
    loadingMessage.edit(
      new MessageEmbed()
        .setTitle(`Case Number #${cases.totalCases} | Warn`)
        .setDescription(`Successfully warned ${target}`)
        .setColor("YELLOW")
    );
    const savedChannel = await guildChannelsModel.findOne({
      guildId: message.guild.id,
    });
    const modLogChannel = savedChannel ? savedChannel.modlogsChannel : null;
    if (!modLogChannel) {
      return;
    } else {
      message.guild.channels.cache.get(modLogChannel).send(
        new MessageEmbed()
          .setTitle(`Case Number #${cases.totalCases} | Warn`)
          .setDescription(
            `**Offender:** ${target.user.tag}\n
             **Responsible Moderator:** ${message.author.tag}\n
             **Reason:** ${reason}`
          )
          .setColor("#F1C40F")
          .setFooter(`ID: ${target.id}`)
          .setTimestamp()
      );
    }
  },
};
