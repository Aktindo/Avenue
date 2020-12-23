const { MessageEmbed } = require('discord.js')
const {confirmation} = require('reconlx')
module.exports = {
    name: "purge",
    description: "Purges some messages in a channel with filters(if any)",
    category: "moderation",
    cooldowns: 5,
    aliases: ['clean', 'clear'],
    requiredPermissions: ["MANAGE_MESSAGES"],
    requiredRoles: "helper",
    usage: "messages <amount>",
    guildOnly: true,
    async execute(client, message, args) {
        if (args[0] == 'messages') {
            let purgeAmount = args[1]
            if (!purgeAmount) return message.channel.send('Please provide some amount to purge.')
            if (isNaN(purgeAmount)) return message.channel.send('Could not parse that integer.')
            if (purgeAmount < 1) return message.channel.send('Cannot parse a negative-integer.')
            if (purgeAmount > 100) return message.channel.send('Cannot parse an integer more than 100.')
            await message.channel.messages.fetch({limit: purgeAmount})
            .then(m => {
                try {
                    message.channel.bulkDelete(purgeAmount)
                } catch (error) {
                    message.channel.send('There was an error!')
                }
            })
            if (args[2] == '--nomsg') {
                return
            }
            else {
                message.channel.send(`Successfully purged ${purgeAmount} messages!`)
            }
        }
    }
}