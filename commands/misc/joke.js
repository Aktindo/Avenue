const { MessageEmbed } = require('discord.js')
const someRandomCat = require('some-random-cat').Random
module.exports = {
    name: "joke",
    description: "Get a random joke!",
    category: "Miscellaneous",
    cooldowns: 5,
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        await someRandomCat.getJoke()
        .then(res => {
            message.channel.send(
                new MessageEmbed()
                .setTitle(res.title)
                .setURL(res.url)
                .setDescription(res.body)
                .setColor('RANDOM')
            )
        })
        .catch(error => {
            message.channel.send(
                client.embedError(message, `Error while fetching response:\n${error}`)
            )
        })
    }
}