const guildChannelModel = require("../../models/guild-channels-model");
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "setchannel",
  description: "A command to set channels such as reports and stuff",
  category: "Settings",
  cooldown: 5,
  aliases: ["set-channel"],
  usage: "<Reports|Welcome|Verification|ModLogs> <Channel?(ID|Mention)>",
  requiredPermissions: ["ADMINISTRATOR"],
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message, args) {
    if (!args[0]) {
      return message.channel.send(
        client.embedError(
          message,
          "Please provide some arguments. See `[prefix]help setchannel` for more information on how to use this command."
        )
      );
    }
    if (args[0].toLowerCase() === "reports") {
      const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]);
      if (!channel) {
        return message.channel.send(
          client.embedError(
            message,
            "No channel found with that mention or ID."
          )
        );
      }
      await guildChannelModel.findOneAndUpdate(
        {
          guildId: message.guild.id,
        },
        {
          guildId: message.guild.id,
          reportChannel: channel.id,
        },
        {
          upsert: true,
        }
      );
      message.channel.send(
        client.embedSuccess(
          message,
          `Successfully set ${channel} as the \`report\` channel!`
        )
      );
    } else if (args[0].toLowerCase() === "welcome") {
      const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]);
      if (!channel) {
        return message.channel.send(
          client.embedError(
            message,
            "No channel found with that mention or ID."
          )
        );
      }
      await guildChannelModel.findOneAndUpdate(
        {
          guildId: message.guild.id,
        },
        {
          guildId: message.guild.id,
          welcomeChannel: channel.id,
        },
        {
          upsert: true,
        }
      );
      message.channel.send(
        client.embedSuccess(
          message,
          `Successfully set ${channel} as the \`welcome\` channel!`
        )
      );
    } else if (args[0].toLowerCase() === "starboard") {
      const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]);
      if (!channel) {
        return message.channel.send(
          client.embedError(
            message,
            "No channel found with that mention or ID."
          )
        );
      }
      await guildChannelModel.findOneAndUpdate(
        {
          guildId: message.guild.id,
        },
        {
          guildId: message.guild.id,
          starboardChannel: channel.id,
        },
        {
          upsert: true,
        }
      );
      message.channel.send(
        client.embedSuccess(
          message,
          `Successfully set ${channel} as the \`starboard\` channel!`
        )
      );
    } else if (args[0].toLowerCase() === "verification") {
      const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]);
      if (!channel) {
        return message.channel.send(
          client.embedError(
            message,
            "No channel found with that mention or ID."
          )
        );
      }
      await guildChannelModel.findOneAndUpdate(
        {
          guildId: message.guild.id,
        },
        {
          guildId: message.guild.id,
          acceptChannel: channel.id,
        },
        {
          upsert: true,
        }
      );
      message.channel.send(
        client.embedSuccess(
          message,
          `Successfully set ${channel} as the \`verification\` channel!`
        )
      );
    } else if (args[0].toLowerCase() === "modlogs") {
      const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]);
      if (!channel) {
        return message.channel.send(
          client.embedError(
            message,
            "No channel found with that mention or ID."
          )
        );
      }
      await guildChannelModel.findOneAndUpdate(
        {
          guildId: message.guild.id,
        },
        {
          guildId: message.guild.id,
          modlogsChannel: channel.id,
        },
        {
          upsert: true,
        }
      );
      message.channel.send(
        client.embedSuccess(
          message,
          `Successfully set ${channel} as the \`modlogs\` channel!`
        )
      );
    } else {
      return message.channel.send(
        new MessageEmbed()
          .setAuthor(message.author.username)
          .setDescription(
            `<:redTick:792047662202617876> Incorrect Syntax! Please use \`[prefix]setchannel ${this.usage}\``
          )
          .setColor("RED")
      );
    }
  },
};
