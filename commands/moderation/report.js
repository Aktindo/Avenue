const { MessageEmbed } = require("discord.js")
const moment = require('moment')
const guildCasesModel = require('../../models/guild-cases-model')
const reportSystemModel = require('../../models/report-system-model')
const guildChannelModel = require('../../models/guild-channels-model')
module.exports = {
    name: "report",
    description: "Reports a user to the authorities(if enabled)",
    category: "Moderation",
    cooldowns: 5,
    aliases: ["reportuser"],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.channel.send(
            client.embedError(message, "Please mention a user.\nSee `[prefix]help report` for more information on how to use this command.")
        )
        const reason = args.slice(1).join(' ')
        if (!reason) return message.channel.send(
            client.embedError(message, "Please provide a reason.")
        )
        const channelData = await guildChannelModel.findOne({
            guildId: message.guild.id
        })
        if (!channelData || !channelData.reportChannel) {
            return message.channel.send(
                client.embedError(message, "This server has no `reports` channel set.")
            )
        }
        const channel = message.guild.channels.cache.get(channelData.reportChannel)
        if (!channel) return message.channel.send(
            client.embedError(message, "The reports channel for this server does not exist anymore.")
        )
        const reportChannelPermissions = channel.permissionsFor(client.user)
        if (!reportChannelPermissions.has("SEND_MESSAGES")) {
            return message.channel.send(
                client.embedError(message, "I do not have permissions to send messages in the reports channel.")
            )
        }
        if (!reportChannelPermissions.has("ATTACH_FILES")) {
            return message.channel.send(
                client.embedError(message, "I do not have permissions to send embeds in the reports channel.")
            )
        }
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
            .setColor('#F39C12')
        )
        loadingMsg.edit(
            new MessageEmbed()
            .setTitle(`Case Number #${cases.totalCases} | Report`)
            .setDescription(`Reported ${user} to the authorities.`)
            .setColor('#F39C12')
        )
    }
}