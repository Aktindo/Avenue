const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "support",
    description: "The link to join the support server",
    category: "System",
    cooldowns: 5,
    aliases: ["supportserver"],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        return message.channel.send(
            client.embedSuccess(message, 'If you want to join the support server, you can click [here](https://discord.gg/xSQMdPEvHt)')
        )
    }
}