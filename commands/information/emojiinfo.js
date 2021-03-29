const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "emojinfo",
  description: "Displays some information on a emoji!",
  aliases: ["emoji", "steal"],
  category: "Information",
  usage: "<emoji>",
  cooldown: 5,
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  guildOnly: true,
  async execute(client, message, args) {
    function getEmoji(msg) {
      const emojiId = msg.replace(/<a?:(.*?):+/g, "").replace(/>+/g, "");
      let imageUrl = `https://cdn.discordapp.com/emojis/${emojiId}`;
      let animated = true;
      if (msg.indexOf("<a:") === 0) {
        imageUrl += ".gif";
      } else if (msg.indexOf("<:") === 0) {
        imageUrl += ".png";
        animated = false;
      } else {
        throw Error("That is not an emoji");
      }

      return [animated, imageUrl, emojiId];
    }

    const emoji = args[0];
    if (!emoji) {
      return message.channel.send(
        client.embedError(message, "Please provide a valid emoji!")
      );
    }

    const embed = new MessageEmbed();
    try {
      const [animated, imageUrl] = getEmoji(emoji);
      embed.setImage(imageUrl);
      embed.setColor(client.env.EMBED_NEUTRAL_COLOR);
      if (animated) {
        embed.setDescription(`[GIF](${imageUrl})`);
      } else {
        embed.setDescription(`[PNG](${imageUrl})`);
      }
    } catch {
      return message.channel.send(
        client.embedError(
          message,
          "There was an error trying to fetch that emoji."
        )
      );
    }
    message.channel.send(embed);
  },
};
