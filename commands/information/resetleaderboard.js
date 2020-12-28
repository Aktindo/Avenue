const { MessageEmbed } = require('discord.js')
const messageCountModel = require('../../models/user-messagecount-model')
module.exports = {
    name: "resetleaderboard",
    description: "Resets a server leadrboard!",
    aliases: ["rlb"],
    category: "information",
    cooldowns: 5,
    guildOnly: true,
    requiredPermissions: ['ADMINISTRATOR'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        const results  = await messageCountModel.find({
            guildId: message.guild.id
        })
        if (!results) return message.channel.send( 
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> This server has no data!')
            .setColor('RED')
        )
        const msg = await message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setTitle('Resetting...')
            .setDescription('Please wait while we reset this server\'s leaderboard.\nIt can take time depending upon the number of members the server has.')
        )
        results.forEach(async result => {
            await messageCountModel.findOneAndRemove({
                guildId: message.guild.id,
                userId: result.userId,
            })
        })
        msg.edit(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription(`<:greenTick:792047523803299850> Successfully reset the server leaderboard!`)
            .setColor('GREEN')
        )
    }
}