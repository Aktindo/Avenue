const { MessageEmbed } = require("discord.js");
const moment = require("moment");
module.exports = {
  name: "roleinfo",
  description: "Displays some information on a role!",
  aliases: ["ri"],
  usage: "<role?(ID|Mention)>",
  category: "Information",
  cooldown: 5,
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message, args) {
    const role =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) {
      return message.channel.send(
        client.embedError(message, "Please provide a valid role.")
      );
    }
    const yesNo = {
      true: "<:greenTick:792047523803299850> Yes",
      false: "<:redTick:792047662202617876> No",
    };
    const embed = new MessageEmbed()
      .setColor(`${role.hexColor}`)
      .setTitle(`Information on ${role.name}`)
      .setDescription(`${role} (\`${role}\`)`)
      .addFields(
        { name: "Name", value: role.name, inline: true },
        { name: "ID", value: role.id, inline: true },
        { name: "Color", value: role.hexColor, inline: true },
        {
          name: "Created At",
          value: `${moment(role.createdAt).format(
            "MMMM Do YYYY, h:mm:ss a"
          )}\n(${moment(role.createdAt, "YYYYMMDD").fromNow()})`,
          inline: false,
        },
        { name: "Position", value: role.position, inline: true },
        { name: "Hoisted", value: yesNo[role.hoist], inline: true },
        { name: "Mentionable", value: yesNo[role.mentionable], inline: true }
      );
    message.channel.send(embed);
  },
};
