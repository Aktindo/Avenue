const { MessageEmbed } = require('discord.js')
const ms = require('ms')
module.exports = {
    name: "slowmode",
    description: "Sets slowmode in a channel",
    category: "Moderation",
    aliases: ["sm", "setslowmode"],
    cooldowns: 5,
    requiredPermissions: ['MANAGE_CHANNELS'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "MANAGE_CHANNELS"],
    usage: "<time?number>",
    async execute(client, message, args) {
        if (!args[0]) {
            return message.channel.send(
                client.embedError(message, "Please provide a time! See `[prefix]help slowmode` for more information on how to use the syntax.")
            )
        }
        if (isNaN(args[0])) {
            return message.channel.send(
                client.embedError(message, "Cannot parse a non-integer!")
            )
        }
        const slowmode = parseInt(args[0])
        if (slowmode <= 0) {
            return message.channel.send(
                client.embedError(message, 'Cannot parse an integer < or = 0.')
            )
        }
        if (slowmode > 21600) {
            return message.channel.send(
                client.embedError(message, 'Cannot parse an integer > 21600.')
            )
        }
        message.channel.setRateLimitPerUser(slowmode)
        message.channel.send(
            client.embedSuccess(message, `Successfully set the slowmode of ${message.channel} to \`${args[0]}\` seconds!`)
        )
    }
}