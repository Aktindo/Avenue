const DiscordJS = require('discord.js')
module.exports = {
    name: "test",
    description: "Tests a temporary command.",
    category: "System",
    cooldowns: 5,
    botOwnerOnly: true,
    guildOnly: true,
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        message.channel.send('Hi')
    }
}