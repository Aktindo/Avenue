const { MessageEmbed } = require("discord.js");
const guildCasesModel = require("../../models/guild-cases-model");
const banSystemModel = require("../../models/ban-system-model");
const guildChannelsModel = require("../../models/guild-channels-model");
module.exports = {
  name: "ban",
  description: "Bans a user(does not delete their messages)",
  category: "Moderation",
  cooldown: 5,
  aliases: ["yeet", "banuser"],
  requiredPermissions: ["BAN_MEMBERS"],
  botPermissions: [
    "SEND_MESSAGES",
    "ATTACH_FILES",
    "USE_EXTERNAL_EMOJIS",
    "BAN_MEMBERS",
  ],
  usage: "<user> [reason]",
  async execute(client, message, args) {
    const target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!target) {
      return message.channel.send(
        client.embedError(message, "Please mention a user.")
      );
    }
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "Not specified";

    const allBans = await message.guild.fetchBans();
    if (allBans.get(target.id)) {
      return message.channel.send(
        client.embedError(message, "That user is already banned.")
      );
    }

    if (target.user.bot) {
      return message.channel.send(
        client.embedError(message, "That user is a bot.")
      );
    }

    if (target.hasPermission("BAN_MEMBERS")) {
      return message.channel.send(
        client.embedError(message, "That user is a moderator/administrator.")
      );
    }

    const loadingMsg = await message.channel.send(
      new MessageEmbed()
        .setAuthor(message.author.username)
        .setDescription(`Banning ${target}... Please wait!`)
    );

    const cases = await guildCasesModel.findOneAndUpdate(
      {
        guildId: message.guild.id,
      },
      {
        guildId: message.guild.id,
        $inc: {
          totalCases: 1,
          banCases: 1,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    await new banSystemModel({
      guildId: message.guild.id,
      userId: target.id,
      caseNumber: cases.totalCases,
      banCaseNumber: cases.banCases,
      moderatorId: message.author.id,
      timestamp: new Date().getTime(),
      reason,
    }).save();

    await target.user
      .send(
        new MessageEmbed()
          .setAuthor(target.user.username, target.user.displayAvatarURL())
          .setTitle(`Case Number #${cases.totalCases} | Ban`)
          .setDescription(
            `You have been kicked in ${message.guild.name} for \`${reason}\``
          )
          .addField("Moderator", message.author)
          .addField("Channel", message.channel)
          .addField("Permanent", "Yes")
          .setColor("RED")
      )
      .catch(() => {
        message.channel.send(
          client.embedSuccess(
            message,
            `Ban logged for ${target}... I could not message them.`
          )
        );
      });
    await message.guild.members.ban(target.id, { reason: reason });
    loadingMsg.edit(
      new MessageEmbed()
        .setTitle(`Case Number #${cases.totalCases} | Permanent Ban`)
        .setDescription(`Successfully banned ${target}`)
        .setColor("RED")
    );
    const savedChannel = await guildChannelsModel.findOne({
      guildId: message.guild.id,
    });
    const modLogChannel = savedChannel ? savedChannel.modlogsChannel : null;
    if (!modLogChannel) {
      return;
    } else {
      message.guild.channels.cache
        .get(modLogChannel)
        .send(
          new MessageEmbed()
            .setTitle(`Case Number #${cases.totalCases} | Ban`)
            .setDescription(
              `**Offender:** ${target.user.tag}\n**Responsible Moderator:** ${message.author.tag}\n**Reason:** ${reason}`
            )
            .setColor("RED")
            .setFooter(`ID: ${target.id}`)
            .setTimestamp()
        );
    }
  },
};
