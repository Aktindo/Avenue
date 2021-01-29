const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "clapify",
    aliases: ["clap"],
    usage: "<text>",
    description: "👏This👏is👏really👏cool!",
    category: "Miscellaneous",
    cooldowns: 5,
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        if (!args.length) {
            return message.channel.send(
                client.embedError(message, 'Please provide some text to clapify!')
            )
        }
        await message.delete()
        message.channel.send(
            args.join('👏')
        )
    }
}