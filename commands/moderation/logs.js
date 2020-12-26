const { MessageEmbed } = require('discord.js')
const warningModel = require('../../models/warning-system-model')
module.exports = {
    name: "logs",
    description: "Views all the logs for a user.",
    category: "moderation",
    cooldowns: 5,
    usage: "[user]",
    requiredRoles: 'helper',
    requiredPermissions: ['MANAGE_MESSAGES'],
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
        .setDescription(`Fetching logs for ${user}... Please wait!`)
        .setColor('BLURPLE')
        const loadingMsg = await message.channel.send(loading)
        const warningLogs = await warningModel.find({
            guildId: message.guild.id,
            userId: user.id
        }).limit(3)
        let warnData = ''
        warningLogs.map(async i => {
            warnData += `**Case Number - ${i.caseNumber}**\nModerator - <@${i.moderatorId}>\nReason - ${i.reason}\nDate - ${new Date(i.timestamp).toLocaleDateString()}\n\n`
        })
        if (!warnData) warnData += 'No previous warnings for the user!'
        const embed = new MessageEmbed()
        .setAuthor(`All logs for ${user.user.username}`, user.user.displayAvatarURL())
        .addField('Last 3 Warnings', warnData, false)
        .setFooter(`In ${message.guild.name}`, message.guild.iconURL())
        .setColor('AQUA')
        loadingMsg.edit(embed)
    }
}