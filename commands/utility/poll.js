const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "poll",
    description: "Makes a quick yes/no poll!",
    aliases: ["instantpoll"],
    category: "Utility",
    cooldowns: 5,
    usage: "<description>",
    requiredPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS"],
    async execute(client, message, args) {
        const pollDesc = args.join(' ')
        if (!pollDesc) {
            return message.channel.send(
                client.embedError(message, "Please provide some description for the poll.")
            )
        }
        message.channel.send(
            new MessageEmbed()
            .setAuthor(`${message.author.username} asks`, message.author.displayAvatarURL())
            .setTitle(pollDesc)
            .setColor('BLURPLE')
        ).then(async m => {
            await m.react('👍')
            await m.react('👎')
        })
    }
}