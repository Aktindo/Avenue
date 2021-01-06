const { MessageEmbed } = require('discord.js')
const guildCasesModel = require('../../models/guild-cases-model')
const banSystemModel = require('../../models/ban-system-model')
module.exports = {
    name: "ban",
    description: "Bans a user(does not delete their messages)",
    category: "Moderation",
    cooldowns: 5,
    requiredPermissions: ['BAN_MEMBERS'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "BAN_MEMBERS"],
    usage: "<user> [reason]",
    async execute(client, message, args) {
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!target) return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> Invalid Syntax! Please mention a user.')
            .setColor('RED')
        )
        let reason = args.slice(1).join(' ')
        if (!reason) reason = "Not specified"

        const allBans = await message.guild.fetchBans()
        if (allBans.get(target.id)) {
            return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> That user is already banned!')
                .setColor('RED')
            )
        }

        if (target.hasPermission('BAN_MEMBERS')) {
            return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> That user is a mod/admin.')
                .setColor('RED')
            )
        }

        const loadingMsg = await message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription(`Banning ${target}... Please wait!`)
        )

        const cases = await guildCasesModel.findOneAndUpdate({
            guildId: message.guild.id,
        }, {
            guildId: message.guild.id,
            $inc: {
                totalCases: 1,
                banCases: 1,
            }
        }, {
            upsert: true,
            new: true,
        })

        await new banSystemModel({
            guildId: message.guild.id,
            userId: target.id,
            caseNumber: cases.totalCases,
            banCaseNumber: cases.banCases,
            moderatorId: message.author.id,
            timestamp: new Date().getTime(),
            reason,
        }).save()

        await target.user.send(
            new MessageEmbed()
            .setAuthor(target.user.username, target.user.displayAvatarURL())
            .setTitle(`Case Number #${cases.totalCases} | Ban`)
            .setDescription(`You have been kicked in ${message.guild.name} for \`${reason}\``)
            .addField('Moderator', message.author)
            .addField('Channel', message.channel)
            .addField('Permanent', 'Yes')
            .setColor('RED')
        ).catch(e => 
        message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription(`<:greenTick:792047523803299850> The user has been banned and the ban has been logged for ${target}... Unfortunately, I could not DM them!`)
            .setColor('GREEN')
        ))
        await message.guild.members.ban(target.id, {reason: reason})
        loadingMsg.edit(
            new MessageEmbed()
            .setTitle(`Case Number #${cases.totalCases} | Ban`)
            .setDescription(`Successfully banned ${target}`)
            .setColor('RED')
        )

    }
}