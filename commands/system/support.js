const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "support",
    description: "The link to join the support server",
    category: "system",
    cooldowns: 5,
    aliases: ["supportserver"],
    async execute(client, message, args) {
        return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:greenTick:792047523803299850> If you want to join the support server, you can click [here](https://discord.gg/xSQMdPEvHt)')
            .setColor('GREEN')
        )
    }
}