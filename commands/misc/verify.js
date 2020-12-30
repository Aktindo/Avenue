const { MessageEmbed } = require("discord.js")
const guildChannelsModel = require("../../models/guild-channels-model")
const guildVerificationSystemModel = require("../../models/guild-verification-system-model")
module.exports = {
    name: "verify",
    description: "Verifies you in a server(if one set)",
    category: "misc",
    cooldowns: 5,
    aliases: ["accept"],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        const verificationData = await guildVerificationSystemModel.findOne({
            guildId: message.guild.id
        })
        const channelData = await guildChannelsModel.findOne({
            guildId: message.guild.id
        })
        if (!channelData) return
        if (!verificationData) return

        let verificationChannel = message.guild.channels.cache.get(channelData.acceptChannel)
        if (!verificationChannel) return
        let role = message.guild.roles.cache.get(verificationData.roleId)
        if (!role) return
        let messageChannel = message.guild.channels.cache.get(verificationData.messageChannelId)
        if (!messageChannel) return
        let text = verificationData.message
        if (!text) return
        if (message.channel.id != verificationChannel.id) return
        if (!message.member.roles.cache.has(role.id)) {
            await message.member.roles.add(role)
            const msg = await message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:greenTick:792047523803299850> You have verified yourself!`)
                .setColor('GREEN')
            )
            await message.delete()
            var variables = {
                "{user}": message.author,
                "{server}": message.guild.name,
                "{membercount}": message.guild.memberCount
             }
             text = text.replace(/{user}|{server}|{membercount}/gi, function(matched){
               return variables[matched]
             })
            messageChannel.send(text)
            await msg.delete({timeout: 5000})
        }
        else {
            await message.delete()
        }
    }
}