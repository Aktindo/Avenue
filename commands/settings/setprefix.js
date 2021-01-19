const {MessageEmbed} = require('discord.js')
const guildGeneralModel = require('../../models/guild-general-model')
module.exports = {
    name: "setprefix",
    description: "A command to set the prefix of the bot!",
    category: "Settings",
    cooldowns: 5,
    aliases: ["prefix"],
    usage: "[newPrefix?lessThan(3 letters)]",
    requiredPermissions: ['ADMINISTRATOR'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        let prefix = ""
        const guildData = await guildGeneralModel.findOne({
            guildId: message.guild.id
        })
        if (!guildData || !guildData.prefix) prefix = "."
        else prefix = guildData.prefix.toString()
        if (!args[0]) {
            return message.channel.send(
                client.embedSuccess(message, `Current prefix is \`${prefix}\``)
            )
        } else {
            let newPrefix = args[0]
            if (newPrefix.length > 3) {
                return message.channel.send(
                    client.embedError(message, "You cannot have a prefix of more than 3 characters.")
                )
            }
            const res = await guildGeneralModel.findOneAndUpdate({
                guildId: message.guild.id
            }, {
                guildId: message.guild.id,
                prefix: newPrefix
            }, {
                upsert: true
            })
            message.channel.send(
                client.embedSuccess(message, `Successfully updated the prefix to \`${newPrefix}\``)
            )
        }
    }
}