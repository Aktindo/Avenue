const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "softban",
    description: "Bans a member then immediately unbans them to purge their old messages.",
    category: "Moderation",
    cooldowns: 5,
    requiredPermissions: ['MANAGE_CHANNELS'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "MANAGE_CHANNELS"],
    async execute(client, message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) {
            return message.channel.send(
                client.embedError(message, 'Please mention a valid user.')
            )
        }
        if (user.hasPermission('BAN_MEMBERS')) {
            return message.channel.send(
                client.embedError(message, 'That user is a moderator/admin.')
            )
        }
        if (user.user.bot) {
            return message.channel.send(
                client.embedError(message, 'That user is a bot.')
            )
        }
        await user.ban({days: 7, reason: 'Requested by a moderator.'})
        message.guild.members.unban(user, 'Requested by a moderator.')
        message.channel.send(
            client.embedSuccess(message, 'Softban successful!')
        )
    }
}