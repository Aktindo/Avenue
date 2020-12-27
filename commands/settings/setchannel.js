const guildChannelModel = require('../../models/guild-channels-model')
const {MessageEmbed} = require('discord.js')
module.exports = {
    name: "setchannel",
    description: "A command to set channels such as reports and stuff",
    category: "settings",
    cooldowns: 5,
    aliases: ["set-channel"],
    usage: "<Reports> <#channel|ID>",
    requiredPermissions: ['ADMINISTRATOR'],
    requiredRoles: "admin",
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
        else {
            return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> Incorrect Syntax! Please use `[prefix]setchannel <Reports> <#channel|ID>`')
                .setColor('RED')
            )
        }
    }
}