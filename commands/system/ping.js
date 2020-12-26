const { MessageEmbed } = require("discord.js")
const { colors } = require('../../data/colors.json')
const guildCasesModel = require('../../models/guild-cases-model')
module.exports = {
    name: "ping",
    description: "A command to test the latency of the bot.",
    category: "system",
    cooldowns: 5,
    aliases: ["p"],
    async execute(client, message, args) {
        message.channel.send('Testing ping...').then(async m => {
            let randomColor = colors[Math.floor(Math.random() * colors.length)]
            let dataPing = Date.now()
            await guildCasesModel.findOne({
                guildId: message.guild.id
            })
            let dataPingNow = Date.now()
            let dataRealPing = dataPingNow - dataPing
            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('🏓 Pong!')
            .setDescription(`Bot Evaluation Time - **${Math.round((m.createdAt - message.createdAt)/(client.ws.ping))}**ms \nBot Latency - **${Math.round(m.createdAt - message.createdAt)}**ms \nAPI Latency - **${Math.round(client.ws.ping)}**ms\nDatabase Latency - **${dataRealPing}**ms`)
            .setColor(randomColor)
            m.edit(embed)
            m.edit("\u200b")
        })
    }
}