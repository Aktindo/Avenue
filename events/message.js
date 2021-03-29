require("dotenv").config();
const DiscordJS = require("discord.js");

const messageCountModel = require("../models/user-messagecount-model");
const guildGeneralModel = require("../models/guild-general-model");
const Log = require("../util/Log");
require("dotenv").config();

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = {
  name: "message",
  once: false,
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    await messageCountModel.findOneAndUpdate(
      {
        guildId: message.guild.id,
        userId: message.author.id,
      },
      {
        guildId: message.guild.id,
        userId: message.author.id,
        $inc: {
          messageCount: 1,
        },
      },
      {
        upsert: true,
      }
    );

    let prefix = "";
    const savedGuild = await guildGeneralModel.findOne({
      _id: message.guild.id,
    });
    if (!savedGuild || !savedGuild.prefix) prefix = client.env.PREFIX;
    else prefix = savedGuild.prefix;
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content.toLowerCase())) return;

    const [, matchedPrefix] = message.content.toLowerCase().match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    let commandChannel;
    if (
      !savedGuild ||
      !savedGuild.commandChannel ||
      savedGuild.commandChannel == "No Channel"
    )
      commandChannel = null;
    else commandChannel = client.channels.cache.get(savedGuild.commandChannel);

    if (commandChannel && command.commandChannelOnly !== false) {
      if (
        message.channel.id != commandChannel.id &&
        !message.member.hasPermission("MANAGE_MESSAGES")
      ) {
        return message.channel.send(
          client.embedError(
            message,
            `You can use commands only in ${commandChannel}`
          )
        );
      }
    }

    if (command.botPermissions) {
      if (!message.guild.me.hasPermission(command.botPermissions)) {
        return message.channel.send(
          client.embedError(
            message,
            `I do not have the required permissions - \`${command.botPermissions.join(
              ", "
            )}\` to run that command in this server!`
          )
        );
      }
    }

    if (
      command.botOwnerOnly &&
      !client.env.BOT_OWNERS.split(",").includes(message.author.id)
    ) {
      return message.channel.send(
        client.embedError(message, "Only the bot owner can run that command!")
      );
    }

    if (command.requiredPermissions) {
      if (!message.member.hasPermission(command.requiredPermissions)) {
        return message.channel.send(
          client.embedError(
            message,
            "You do not have the required permissions to run that command."
          )
        );
      }
    }

    if (!client.cooldown.has(command.name)) {
      client.cooldown.set(command.name, new DiscordJS.Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldown.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.channel.send(
          client.embedError(
            message,
            `You are on cooldown for the command **${
              command.name
            }**.\nPlease wait **${timeLeft.toFixed(
              1
            )}**s before using that command again.`
          )
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(client, message, args);
      client.logger.info(
        `Ran the command (${command.name}) in ${message.guild.name} (${message.guild.id}) used by ${message.author.tag} (${message.author.id}).`,
        "command_handler"
      );
    } catch (error) {
      client.logger.error(
        `Could not run command (${command.name}) in ${message.guild.name} (${message.guild.id}).\n${error.message}`,
        "command_handler"
      );
      message.channel.send(
        client.embedError(
          message,
          "There was an unexpected error trying to run that command.\nThis error has been sent to the developer."
        )
      );
    }
  },
};
