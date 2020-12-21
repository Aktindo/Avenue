const { MessageEmbed } = require("discord.js")
const { colors } = require('../../data/colors.json')
module.exports = {
    name: "ping",
    description: "A command to test the latency of the bot.",
    category: "system",
    cooldowns: 5,
    aliases: ["p"],
    execute(client, message, args) {
        message.channel.send('Testing ping...').then(m => {
            let randomColor = colors[Math.floor(Math.random() * colors.length)]
            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('🏓 Pong!')
            .setDescription(`Bot Evaluation Time - **${Math.round((m.createdAt - message.createdAt)/(client.ws.ping))}**ms \n Bot Latency - **${Math.round(m.createdAt - message.createdAt)}**ms \n API Latency - **${Math.round(client.ws.ping)}**ms`)
            .setColor(randomColor)
            m.edit(embed)
            m.edit("\u200b")
        })
    }
}