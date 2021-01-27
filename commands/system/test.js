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
        const messages = await message.channel.messages.fetch({limit: 2})
    }
}