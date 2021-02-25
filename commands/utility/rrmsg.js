const { MessageEmbed } = require('discord.js')
const reactionSchema = require('../../models/reaction-role-model')
const { addToCache } = require('../../features/rr')

module.exports = {
    name: "rrmsg",
    description: "Creates the reaction role message.",
    category: "Utility",
    cooldowns: 5,
    requiredPermissions: ['MANAGE_ROLES'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "MANAGE_ROLES", "MANAGE_MESSAGES"],
    usage: "[Channel] <Message>",
    async execute(client, message, args) {
        const { guild, mentions } = message
        const { channels } = mentions
        const targetChannel = channels.first() || message.channel

        if (channels.first()) {
            args.shift()
        }

        const text = args.join(' ')
        if (!text) {
            return message.channel.send(
              client.embedError(message, 'Please provide a valid message for the reaction roles.')
            )
        }

        const newMessage = await targetChannel.send(text)

        addToCache(guild.id, newMessage)

        new reactionSchema({
        guildId: guild.id,
        channelId: targetChannel.id,
        messageId: newMessage.id,
        })
        .save()
        .catch(() => {
            message
            .channel.send(
                client.embedError(message, 'Failed to save to database. Try again later.')
            )
            .then((message) => {
                    message.delete({
                    timeout: 1000 * 10,
                })
            })
        })
    }
}