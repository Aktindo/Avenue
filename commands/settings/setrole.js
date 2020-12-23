const guildRoleModel = require('../../models/guild-roles-model')
module.exports = {
    name: "setrole",
    description: "A command to set roles for staff members and the muted role",
    category: "settings",
    cooldowns: 5,
    aliases: ["set-role"],
    usage: "<Muted|Helper|Moderator|Administrator> <@role|ID>",
    guildOnly: true,
    requiredPermissions: ['ADMINISTRATOR'],
    requiredRoles: "admin",
    async execute(client, message, args) {
        if (args[0].toLowerCase() == 'muted') {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
            if (!role) return message.channel.send('Could not find that role!')
            await guildRoleModel.findOneAndUpdate({
                guildId: message.guild.id,
            }, {
                guildId: message.guild.id,
                helperRole: role.id,
            }, {
                upsert: true,
            })
            message.channel.send(`Successfully set ${role.name} as the muted role.`)
        }
        if (args[0].toLowerCase() == 'helper') {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
            if (!role) return message.channel.send('Could not find that role!')
            await guildRoleModel.findOneAndUpdate({
                guildId: message.guild.id,
            }, {
                guildId: message.guild.id,
                helperRole: role.id,
            }, {
                upsert: true,
            })
            message.channel.send(`Successfully set ${role.name} as the helper role.`)
        }
        if (args[0].toLowerCase() == 'moderator') {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
            if (!role) return message.channel.send('Could not find that role!')
            await guildRoleModel.findOneAndUpdate({
                guildId: message.guild.id,
            }, {
                guildId: message.guild.id,
                moderatorRole: role.id
            }, {
                upsert: true,
            })
            message.channel.send(`Successfully set ${role.name} as the moderator role.`)
        }
        if (args[0].toLowerCase() == 'administrator') {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
            if (!role) return message.channel.send('Could not find that role!')
            await guildRoleModel.findOneAndUpdate({
                guildId: message.guild.id,
            }, {
                guildId: message.guild.id,
                adminRole: role.id
            }, {
                upsert: true,
            })
            message.channel.send(`Successfully set ${role.name} as the administrator role.`)
        }
    }
}