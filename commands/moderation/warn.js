const { MessageEmbed } = require('discord.js')
const guildCasesModel = require('../../models/guild-cases-model')
const warningModel = require('../../models/warning-system-model')
module.exports = {
    name: "warn",
    description: "Warns a user.",
    category: "moderation",
    cooldowns: 5,
    requiredPermissions: ["MANAGE_MESSAGES"],
    requiredRoles: "helper",
    usage: "<user> [reason]",
    guildOnly: true,
    async execute(client, message, args) {
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!target) return message.channel.send('Please provide a user.')

        if (target.id === message.author.id) return message.channel.send('You cannot warn yourself...')
        
        let reason = args.slice(1).join(' ')
        if (!reason) reason = "Not specified"

        const loadingMessage = await message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription(`Warning ${target}... Please wait!`)
        )
        const cases = await guildCasesModel.findOneAndUpdate({
            guildId: message.guild.id,
        }, {
            $inc: {
                totalCases: 1,
                warnCases: 1
            }
        }, {
            upsert: true,
            new: true,
        })
        await new warningModel({
            guildId: message.guild.id,
            userId: target.id,
            caseNumber: cases.totalCases,
            warnCaseNumber: cases.warnCases,
            moderatorId: message.author.id,
            timestamp: new Date().getTime(),
            reason,
        }).save()
        target.send(
            new MessageEmbed()
            .setAuthor(target.user.username, target.user.displayAvatarURL())
            .setTitle(`You have been warned in ${message.guild.name}`)
            .addField('Case Number', cases.totalCases, false)
            .addField('Moderator', message.author.tag, false)
            .addField('Reason', reason, false)
            .setColor('YELLOW')
            .setFooter(`Sent from ${message.guild.name}`, message.guild.iconURL())
        ).catch(e => message.channel.send(`Warning logged for ${target.user.username}... I could not DM them.`))
        loadingMessage.edit(
            new MessageEmbed()
            .setTitle(`Case Number #${cases.totalCases} | Warn`)
            .setDescription(`Successfully warned ${target}`)
        )
    }
}