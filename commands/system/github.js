const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "github",
    description: "The link to view the bot's github repo.",
    category: "System",
    cooldowns: 5,
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        return message.channel.send(
            client.embedSuccess(message, 'If you want to view the github repo, you can click [here](https://avenue.aktindo.repl.co/github)')
        )
    }
}