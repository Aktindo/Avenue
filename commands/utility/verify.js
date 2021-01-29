const { MessageEmbed } = require("discord.js")
const guildChannelsModel = require("../../models/guild-channels-model")
const guildVerificationSystemModel = require("../../models/guild-verification-system-model")
module.exports = {
    name: "verify",
    description: "Verifies you in a server(if one set)",
    category: "Utility",
    cooldowns: 5,
    aliases: ["accept"],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    commandChannelOnly: false,
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
            if (!message.member.manageable) {
                return message.channel.send(
                    new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setDescription('There was an unexpected error while executing that command.\nMy role is below the role specified that is why I cannot assign that role.\nPlease contact a mod/admin')
                )
            }
            await message.member.roles.add(role)
            const msg = await message.channel.send(
                client.embedSuccess(message, 'You have verified yourself!')
            )
            await message.delete({timeout: 1000 * 5})
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