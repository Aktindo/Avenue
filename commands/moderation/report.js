const { MessageEmbed } = require("discord.js")
const moment = require('moment')
const guildCasesModel = require('../../models/guild-cases-model')
const reportSystemModel = require('../../models/report-system-model')
const guildChannelModel = require('../../models/guild-channels-model')
module.exports = {
    name: "report",
    description: "Reports a user to the authorities(if enabled)",
    category: "moderation",
    cooldowns: 5,
    aliases: ["reportuser"],
    async execute(client, message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> Invalid Syntax! Please mention a user.')
            .setColor('RED')
        )
        const reason = args.slice(1).join(' ')
        if (!reason) return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> Invalid Syntax! Please provide a reason for the report.')
            .setColor('RED')
        )
        const channelData = await guildChannelModel.findOne({
            guildId: message.guild.id
        })
        if (!channelData) {
            return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> This server has no `reports` channel setup. Please contact a server mod/admin.')
                .setColor('RED')
            )
        }
        const channel = message.guild.channels.cache.get(channelData.reportChannel)
        if (!channel) return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> There was an error sending your report - The channel that is setup for `reports` for this server does not exist anymore. Please contact a server mod/admin.')
            .setColor('RED')
        )
        const loadingMsg = await message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription(`Reporting ${user}... Please wait!`)
        )
        const cases = await guildCasesModel.findOneAndUpdate({
            guildId: message.guild.id
        }, {
            guildId: message.guild.id,
            $inc: {
                totalCases: 1,
                reportCases: 1
            }
        }, {
            upsert: true,
            new: true
        })
        await new reportSystemModel({
            guildId: message.guild.id,
            userId: user.id,
            caseNumber: cases.totalCases,
            reportCaseNumber: cases.reportCases,
            reporterId: message.author.id,
            reason,
            timestamp: new Date().getTime(),
        }).save()
        await channel.send(
            new MessageEmbed()
            .setAuthor(`Case Number #${cases.totalCases} | Report`)
            .setTitle('Information')
            .addField(`Reporter`, message.author, true)
            .addField('User reported', user, true)
            .addField('In channel', message.channel, true)
            .addField('Reason', reason, false)
            .addField('Reported on', moment(new Date().getTime()).format('MMMM Do YYYY | h:mm:ss a'))
            .setColor('ORANGE')
        )
        loadingMsg.edit(
            new MessageEmbed()
            .setTitle(`Case Number #${cases.totalCases} | Report`)
            .setDescription(`Reported ${user} to the authorities.`)
            .setColor('ORANGE')
        )
    }
}