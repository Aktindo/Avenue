const { MessageEmbed } = require('discord.js')
const someRandomCat = require('some-random-cat').Random
module.exports = {
    name: "dog",
    description: "Get picture of a random dog!",
    category: "Miscellaneous",
    cooldowns: 5,
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        await someRandomCat.getDog()
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