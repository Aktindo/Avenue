const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "poll",
    description: "Makes a quick yes/no poll!",
    aliases: ["instantpoll"],
    category: "Miscellaneous",
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
        await message.delete()
        message.channel.send(
            new MessageEmbed()
            .setAuthor(`${message.author.username} asks`, message.author.displayAvatarURL())
            .setTitle(pollDesc)
            .setFooter(client.user.username, client.user.displayAvatarURL({format:"png"}))
            .setColor('BLURPLE')
        ).then(async m => {
            await m.react('👍')
            await m.react('👎')
        })
    }
}