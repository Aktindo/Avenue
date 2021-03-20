const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "avatar",
  description: "Displays your avatar!",
  aliases: ["av", "pfp"],
  category: "Information",
  cooldown: 5,
  usage: "[user]",
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message, args) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    const embed = new MessageEmbed()
      .setAuthor(`${member.user.username}'s Avatar`)
      .setImage(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setColor("BLURPLE");
    message.channel.send(embed);
  },
};
