const { MessageEmbed } = require('discord.js')
const reportSystemModel = require('../../models/report-system-model')
const warningModel = require('../../models/warning-system-model')
const banSystemModel = require('../../models/ban-system-model')
const moment = require('moment')
const kickSystemModel = require('../../models/kick-system-model')
module.exports = {
    name: "logs",
    description: "Views all the logs for a user.",
    category: "Moderation",
    cooldowns: 5,
    usage: "[user]",
    requiredPermissions: ['MANAGE_MESSAGES'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    guildOnly: true,
    async execute(client, message, args) {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        if (user.user.bot) return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> You cannot fetch logs for bots!')
            .setColor('RED')
        )
        const loading = new MessageEmbed()
        .setAuthor(message.author.username)
        .setDescription(`Fetching logs for ${user}... Please wait!`)
        const loadingMsg = await message.channel.send(loading)
        const warningLogs = await warningModel.find({
            guildId: message.guild.id,
            userId: user.id
        })
        .limit(3)
        let warnData = ''
        warningLogs.map(async i => {
            warnData += `**Case Number - ${i.caseNumber}**\nModerator - <@${i.moderatorId}>\nReason - ${i.reason}\nTime - ${moment(i.timestamp).calendar()}\n\n`
        })
        if (!warnData) warnData += 'No previous warnings for the user!'
        const banLogs = await banSystemModel.find({
            guildId: message.guild.id,
            userId: user.id
        }).limit(3)
        let banData = ''
        banLogs.map(async i => {
            banData += `**Case Number - ${i.caseNumber}**\nModerator - <@${i.moderatorId}>\nReason - ${i.reason}\nTime - ${moment(i.timestamp).calendar()}\n\n`
        })
        if (!banData) banData += 'No previous bans for the user!'
        const kickLogs = await kickSystemModel.find({
            guildId: message.guild.id,
            userId: user.id
        }).limit(3)
        let kickData = ''
        kickLogs.map(async i => {
            kickData += `**Case Number - ${i.caseNumber}**\nModerator - <@${i.moderatorId}>\nReason - ${i.reason}\nTime - ${moment(i.timestamp).calendar()}\n\n`
        })
        if (!kickData) kickData += 'No previous bans for the user!'
        const reportLogs = await reportSystemModel.find({
            guildId: message.guild.id,
            userId: user.id
        })
        .limit(3)
        let reportData = ''
        reportLogs.map(async i => {
            reportData += `**Case Number - ${i.caseNumber}**\nReporter - <@${i.reporterId}>\nReason - ${i.reason}\nDate - ${moment(i.timestamp).calendar()}\n\n`
        })
        if (!reportData) {
            reportData += "No previous reports for the user!"
        }
        const embed = new MessageEmbed()
        .setAuthor(`All logs for ${user.user.username}`, user.user.displayAvatarURL())
        .addField('Last 3 Warnings', warnData, false)
        .addField('Last 3 Reports', reportData, false)
        .addField('Last 3 Bans', banData, false)
        .addField('Last 3 Kicks', kickData, false)
        .setFooter(`In ${message.guild.name}`, message.guild.iconURL())
        .setColor('BLURPLE')
        loadingMsg.edit(embed)
    }
}