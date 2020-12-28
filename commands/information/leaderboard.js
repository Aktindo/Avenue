const { MessageEmbed } = require('discord.js')
const messageCountModel = require('../../models/user-messagecount-model')
module.exports = {
    name: "leaderboard",
    description: "Shows the server's top members with the most messages!",
    aliases: ["messagelb", "lb"],
    category: "information",
    cooldowns: 5,
    usage: "[limit]",
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    guildOnly: true,
    async execute(client, message, args) {
        let limit = args[0]
        if (!limit) limit = 10
        if (isNaN(limit)) {
            return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> Please provide a valid number!')
                .setColor('RED')
            )
        }
        if (limit > 25) {
            return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> You cannot provide a number more than 25!')
                .setColor('RED')
            )
        }
        if (limit <= 0) {
            return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> You cannot provide a number less or equal to 0!')
                .setColor('RED')
            )
        }

        let text = ''

        const results = await messageCountModel
          .find({
            guildId: message.guild.id
          })
          .sort({
            messageCount: -1,
          })
          .limit(parseInt(limit))

          if (!results) return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> This server has no data.')
            .setColor('RED')
          )
      
        for (let counter = 0; counter < results.length; ++counter) {
          const { userId, messageCount = 0 } = results[counter]
      
          text += `\`${counter + 1}.\` <@${userId}> with \`${messageCount}\` messages\n`
        }

        message.channel.send(
            new MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setTitle('Message Leaderboard')
            .setDescription(text)
            .setColor('AQUA')
        )
    }
}