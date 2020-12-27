const { MessageEmbed } = require('discord.js')
const warningModel = require('../../models/warning-system-model')
const reportSystemModel = require('../../models/report-system-model')
const report = require('./report')
module.exports = {
    name: "editcase",
    description: "Edits an existing case of a user.",
    category: "moderation",
    cooldowns: 5,
    usage: "<case_number> [reason]",
    requiredRoles: 'helper',
    requiredPermissions: ['MANAGE_MESSAGES'],
    guildOnly: true,
    async execute(client, message, args) {
        let _caseNumber = args[0]
        if (isNaN(_caseNumber)) return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> Please provide a valid case number!')
            .setColor('RED')
        )
        if (_caseNumber < 0) return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> Please provide a valid case number!')
            .setColor('RED')
        )
        let caseNumber = parseInt(_caseNumber)
        let newReason = args.slice(1).join(' ')
        if (!newReason) newReason = "Not specified"
        const warningResult = await warningModel.findOneAndUpdate({
            guildId: message.guild.id,
            caseNumber,
        }, {
            reason: newReason,
        })
        const reportResult = await reportSystemModel.findOneAndUpdate({
            guildId: message.guild.id,
            caseNumber,
        }, {
            reason: newReason
        })
        if (!warningResult && !reportResult) {
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> There is no case with that case number!')
                .setColor('RED')
            )
        }
        else if (warningResult || reportResult) {
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:greenTick:792047523803299850> Successfully edited case number - \`${_caseNumber}\``)
                .setColor('GREEN')
            )
        }
    }
}