const { MessageEmbed } = require('discord.js')
const warningModel = require('../../models/warning-system-model')
module.exports = {
    name: "editcase",
    description: "Edits an existing case of a user.",
    category: "moderation",
    cooldowns: 5,
    usage: "<user> <case_number> [reason]",
    requiredRoles: 'helper',
    requiredPermissions: ['MANAGE_MESSAGES'],
    async execute(client, message, args) {
        let user = message.mentions.members.first()
        if (!user) return message.channel.send('Please mention a user.')
        let _caseNumber = args[1]
        if (isNaN(_caseNumber)) return message.channel.send('Cannot parse a non-integer.')
        if (_caseNumber < 0) return message.channel.send('Case number cannot be a negative integer.')
        let caseNumber = parseInt(_caseNumber)
        let newReason = args.slice(2).join(' ')
        if (!newReason) newReason = "Not specified"
        warningModel.findOneAndUpdate({
            guildId: message.guild.id,
            userId: user.id,
            caseNumber,
        }, {
            reason: newReason,
        }, (err, res) => {
            if (err) throw err
            if (!res) return message.channel.send('No logs found with that case number!')
            console.log(res)
            message.channel.send('Successfully updated the case!')
        })
    }
}