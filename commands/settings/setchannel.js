const guildChannelModel = require('../../models/guild-channels-model')
const {MessageEmbed} = require('discord.js')
module.exports = {
    name: "setchannel",
    description: "A command to set channels such as reports and stuff",
    category: "Settings",
    cooldowns: 5,
    aliases: ["set-channel"],
    usage: "<Reports|Welcome|Verification> <#channel|ID>",
    requiredPermissions: ['ADMINISTRATOR'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        if (!args[0]) {
            return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> Incorrect Syntax! Please use `[prefix]setchannel <Reports> <#channel|ID>`')
                .setColor('RED')
            )
        }
        if (args[0].toLowerCase() === 'reports') {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!channel) return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> No channel found with that ID.')
                .setColor('RED')
            )
            await guildChannelModel.findOneAndUpdate({
                guildId: message.guild.id,
            }, {
                guildId: message.guild.id,
                reportChannel: channel.id
            }, {
                upsert: true
            })
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:greenTick:792047523803299850> Successfully set ${channel} as the \`reports\` channel!`)
                .setColor('GREEN')
            )
        }
        else if (args[0].toLowerCase() === 'welcome') {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!channel) return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> No channel found with that ID.')
                .setColor('RED')
            )
            await guildChannelModel.findOneAndUpdate({
                guildId: message.guild.id,
            }, {
                guildId: message.guild.id,
                welcomeChannel: channel.id
            }, {
                upsert: true
            })
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:greenTick:792047523803299850> Successfully set ${channel} as the \`welcome\` channel!`)
                .setColor('GREEN')
            )
        }
        else if (args[0].toLowerCase() === 'verification') {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!channel) return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> No channel found with that ID.')
                .setColor('RED')
            )
            await guildChannelModel.findOneAndUpdate({
                guildId: message.guild.id,
            }, {
                guildId: message.guild.id,
                acceptChannel: channel.id
            }, {
                upsert: true
            })
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:greenTick:792047523803299850> Successfully set ${channel} as the \`verification\` channel!`)
                .setColor('GREEN')
            )
        }
        else {
            return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> Incorrect Syntax! Please use `[prefix]setchannel <Reports|Welcome|Verification> <#channel|ID>`')
                .setColor('RED')
            )
        }
    }
}