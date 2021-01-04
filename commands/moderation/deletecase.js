const { MessageEmbed } = require('discord.js')
const banSystemModel = require('../../models/ban-system-model')
const kickSystemModel = require('../../models/kick-system-model')
module.exports = {
    name: "deletecase",
    description: "Deletes an existing case of a user.",
    aliases: ["delcase"],
    category: "moderation",
    cooldowns: 5,
    usage: "<case_number>",
    requiredPermissions: ['MANAGE_MESSAGES'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    guildOnly: true,
    async execute(client, message, args) {
        const warningModel = require('../../models/warning-system-model')
        const reportSystemModel = require('../../models/report-system-model')
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
        const warningResult = await warningModel.findOneAndRemove({
            guildId: message.guild.id,
            caseNumber: caseNumber,
        })
        const reportResult = await reportSystemModel.findOneAndRemove({
            guildId: message.guild.id,
            caseNumber: caseNumber,
        })
        const banResult = await banSystemModel.findOneAndRemove({
            guildId: message.guild.id,
            caseNumber: caseNumber,
        })
        const kickResult = await kickSystemModel.findOneAndRemove({
            guildId: message.guild.id,
            caseNumber: caseNumber,
        })
        if (!warningResult && !reportResult && banResult && kickResult) return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> No case found with that case number!')
            .setColor('RED')
        )
        else if (warningResult || reportResult || banResult || kickResult) {
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:greenTick:792047523803299850> Successfully deleted the case number - `' + _caseNumber + '`')
                .setColor('GREEN')
            )
        }
        
    }
}