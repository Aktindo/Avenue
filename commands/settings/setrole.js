const guildRoleModel = require('../../models/guild-roles-model')
const {MessageEmbed} = require('discord.js')
module.exports = {
    name: "setrole",
    description: "A command to set roles for staff members and the muted role",
    category: "settings",
    cooldowns: 5,
    aliases: ["set-role"],
    usage: "<Muted> <@role|ID>",
    guildOnly: true,
    requiredPermissions: ['ADMINISTRATOR'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> Incorrect Syntax! Please use `[prefix]setrole <Muted> <role>`')
            .setColor('RED')
        )
        if (args[0].toLowerCase() == 'muted') {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
            if (!role) return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> No role found with that ID.')
                .setColor('RED')
            )
            await guildRoleModel.findOneAndUpdate({
                guildId: message.guild.id,
            }, {
                guildId: message.guild.id,
                mutedRole: role.id,
            }, {
                upsert: true,
            })
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:greenTick:792047523803299850> Successfully set ${role} as the \`muted\` role!`)
                .setColor('GREEN')
            )
        }
        else {
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> Incorrect Syntax! Please use `[prefix]setrole <Muted> <role>`')
            .setColor('RED')
        }
    }
}