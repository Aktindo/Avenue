const { MessageEmbed } = require("discord.js");
const guildChannelsModel = require("../../models/guild-channels-model");
const guildWelcomeModel = require("../../models/guild-welcome-model");
module.exports = {
  name: "setwelcome",
  description:
    "A command to set the welcome text and see server welcome settings",
  category: "Settings",
  cooldown: 5,
  aliases: ["welcome"],
  usage:
    "<-text>|<-disable>|<-simjoin>|<-settings> <welcomeText{user|server|membercount}?text(true)>",
  variables: ["{member}", "{server}", "{membercount}"],
  requiredPermissions: ["MANAGE_GUILD"],
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message, args) {
    const channelData = await guildChannelsModel.findOne({
      guildId: message.guild.id,
    });
    const welcomeData = await guildWelcomeModel.findOne({
      guildId: message.guild.id,
    });

    if (!args[0]) {
      return message.channel.send(
        client.embedError(
          message,
          `Invalid Syntax!\nPlease use \`[prefix]${this.name} ${this.usage}\``
        )
      );
    }

    if (args[0].toLowerCase() === "-simjoin") {
      let welcomeChannel;
      if (channelData && channelData.welcomeChannel) {
        welcomeChannel = channelData.welcomeChannel;
      } else {
        welcomeChannel = null;
      }

      if (welcomeChannel && welcomeData && welcomeData.text) {
        client.emit("guildMemberAdd", message.member);
      } else {
        return message.channel.send(
          client.embedError(
            message,
            `You cannot simulate the welcome as there is no welcome channel/text set.\nPlease use \`[prefix]${this.name} -settings\` to view the server welcome settings.`
          )
        );
      }
    } else if (args[0].toLowerCase() === "-settings") {
      let welcomeChannel;
      if (channelData && channelData.welcomeChannel) {
        welcomeChannel = message.guild.channels.cache.get(
          channelData.welcomeChannel
        );
      } else {
        welcomeChannel = null;
      }

      let welcomeText;
      if (welcomeData && welcomeData.text) {
        welcomeText = welcomeData.text;
      } else {
        welcomeText = null;
      }

      const embed = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setTitle("Welcome Settings")
        .addField(
          "Channel",
          welcomeChannel ? welcomeChannel : "No welcome channel set",
          true
        )
        .addField(
          "Text",
          welcomeText ? welcomeText : "No welcome text set",
          true
        )
        .addField("Functioning", welcomeChannel && welcomeText ? "Yes" : "No")
        .setColor(client.env.EMBED_NEUTRAL_COLOR);
      message.channel.send(embed);
    } else if (args[0].toLowerCase() === "-text") {
      const text = args.slice(1).join(" ");
      if (!text) {
        return message.channel.send(
          client.embedError(
            message,
            `Invalid Syntax!\nPlease use \`[prefix]${this.name} ${this.usage}\``
          )
        );
      }
      if (text.length > 1024) {
        return message.channel.send(
          client.embedError(
            message,
            `The welcome message cannot be longer than 1024 characters.\nYou provided (${text.length}/1024)`
          )
        );
      }
      await guildWelcomeModel.findOneAndUpdate(
        {
          guildId: message.guild.id,
        },
        {
          guildId: message.guild.id,
          text,
        },
        {
          upsert: true,
        }
      );
      message.channel.send(
        client.embedSuccess(message, "Successfully set the `welcome` text!")
      );
    } else if (args[0].toLowerCase() === "-disable") {
      const loadingMsg = await message.channel.send(
        "Please wait a second till we remove your welcome data."
      );

      await guildChannelsModel.findOneAndRemove({
        guildId: message.guild.id,
      });

      await guildWelcomeModel.findOneAndRemove({
        guildId: message.guild.id,
      });

      loadingMsg.edit(
        "Successfully disabled the welcome module in this server!"
      );
    } else {
      message.channel.send(
        client.embedError(
          message,
          `Invalid syntax! Please see \`[prefix]help ${this.name}\` more information on how to use this command.`
        )
      );
    }
  },
};
