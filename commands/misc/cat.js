const { MessageEmbed } = require('discord.js')
const someRandomCat = require('some-random-cat').Random
module.exports = {
    name: "cat",
    description: "Get picture of a random cat!",
    category: "Miscellaneous",
    cooldowns: 5,
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        await someRandomCat.getCat()
        .then(res => {
            message.channel.send(res)
        })
        .catch(error => {
            message.channel.send(
                client.embedError(message, `Error while fetching response:\n${error}`)
            )
        })
    }
}