const { MessageEmbed } = require('discord.js')
const axios = require('axios').default
module.exports = {
    name: "pick",
    description: "Picks an option!",
    category: "Miscellaneous",
    cooldowns: 5,
    usage: "<options?seperatedBy(\"\")>",
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        const choices = [];

        const regex = /(["'])((?:\\\1|\1\1|(?!\1).)*)\1/g;
        let match;
        while (match = regex.exec(args.join(' '))) choices.push(match[2]);

        if (!choices.length) {
            return message.channel.send(
                client.embedError(message, "Please provide some options.")
            )
        }
        const answer = choices[Math.floor(Math.random() * choices.length)]
        message.channel.send(
            client.embedSuccess(message, `My pick is \`${answer}\` (1/${choices.length}, ${1/choices.length*100}%)`)
        )
    }
}