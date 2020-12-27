const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "invite",
    description: "The invite link to invite the bot to your server",
    category: "system",
    cooldowns: 5,
    aliases: ["inv"],
    async execute(client, message, args) {
        return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:greenTick:792047523803299850> If you  want to use me in your server(s), click [here](https://discord.com/oauth2/authorize?client_id=790198442668064789&scope=bot&permissions=2113273591)')
            .setColor('GREEN')
        )
    }
}