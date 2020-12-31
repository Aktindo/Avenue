const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "avatar",
    description: "Displays your avatar!",
    aliases: ["av", "pfp"],
    category: "information",
    cooldowns: 5,
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        const embed = new MessageEmbed()
        .setAuthor(`${member.user.username}'s Avatar`)
        .setImage(member.user.displayAvatarURL({dynamic: true, size: 4096}))
        .setColor('AQUA')
        message.channel.send(embed)
    }
}