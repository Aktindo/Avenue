const guildRoleModel = require('../../models/guild-roles-model')
const {MessageEmbed} = require('discord.js')
module.exports = {
    name: "setrole",
    description: "A command to set roles for staff members and the muted role",
    category: "Settings",
    cooldowns: 5,
    aliases: ["set-role"],
    usage: "<Muted> <@role|ID>",
    guildOnly: true,
    requiredPermissions: ['ADMINISTRATOR'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(
            client.embedError(message, `Invalid Syntax!\nPlease use [prefix]${this.name} ${this.usage}`)
        )
        if (args[0].toLowerCase() == 'muted') {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
            if (!role) return message.channel.send(
                client.embedError(message, `No role found with that mention or ID.`)
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
                client.embedSuccess(message, `Successfully set ${role} as the \`muted\` role!`)
            )
        }
        else {
            return message.channel.send(
                client.embedError(message, `Invalid Syntax!\nPlease use [prefix]${this.name} ${this.usage}`)
            )
        }
    }
}