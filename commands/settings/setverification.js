const { MessageEmbed, RichPresenceAssets } = require("discord.js")
const guildChannelsModel = require("../../models/guild-channels-model")
const guildVerificationSystemModel = require("../../models/guild-verification-system-model")

module.exports = {
    name: "setverification",
    description: "Set all the verification system you need in your server!",
    category: "settings",
    usage: "<role|messagechannel|message>|[--info|--settings] <<role|ID>|<channel|ID>|<message>>",
    cooldowns: 5,
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    requiredPermissions: ['ADMINISTRATOR'],
    variables: ["{member}", "{server}", "{membercount}"],
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription(`<:redTick:792047662202617876> Incorrect Syntax! Please use \`[prefix]${this.name} ${this.usage}\``)
            .setColor('RED')
        )
        if (args[0].toLowerCase() == "role") {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
            if (!role) return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:redTick:792047662202617876> No role found with that mention or ID.`)
                .setColor('RED')
            )
            
            await guildVerificationSystemModel.findOneAndUpdate({
                guildId: message.guild.id
            }, {
                guildId: message.guild.id,
                roleId: role.id
            }, {
                upsert: true
            })
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:greenTick:792047523803299850> Successfully set ${role} as the \`verification\` role!`)
                .setColor('GREEN')
            )
        }
        else if (args[0].toLowerCase() == 'messagechannel') {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!channel) return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:redTick:792047662202617876> No channel found with that mention or ID.`)
                .setColor('RED')
            )
            await guildVerificationSystemModel.findOneAndUpdate({
                guildId: message.guild.id
            }, {
                guildId: message.guild.id,
                messageChannelId: channel.id
            }, {
                upsert: true
            })
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:greenTick:792047523803299850> Successfully set ${channel} as the \`message\` channel!`)
                .setColor('GREEN')
            )
        }
        else if (args[0].toLowerCase() == 'message') {
            let text = args.slice(1).join(" ")
            await guildVerificationSystemModel.findOneAndUpdate({
                guildId: message.guild.id
            }, {
                guildId: message.guild.id,
                message: text
            }, {
                upsert: true
            })
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:greenTick:792047523803299850> Successfully set ${text} as the \`message\`!`)
                .setColor('GREEN')
            )
        }
        else if (args[0].toLowerCase() == '--info') {
            message.channel.send(
                new MessageEmbed()
                .setTitle('How to use the verification system?')
                .setDescription(`Wondering how to set a verification system for your server?\nWell, you can set it using **Avenue**!\nFirst, set the verification channel using \`[prefix]setchannel\`\nThen, setup all the required types for the verification command - \`[prefix]help setverification\`\nYou can use the variables to make the message dynamic.\nAnd... That should be it! Whenever a user joins the server, they type \`[prefix]a!verify\` to verify themselves in the server.\n It will then add the role given to them and send the message in another channel!`)
                .setColor('AQUA')
            )
        }
        else if (args[0].toLowerCase() == '--settings') {
            let verificationData = await guildVerificationSystemModel.findOne({
                guildId: message.guild.id
            })
            let channelData = await guildChannelsModel.findOne({
                guildId: message.guild.id
            })



            let verificationChannel
            let role
            let messageChannel
            let text
            if (verificationData) {
                role = message.guild.roles.cache.get(verificationData.roleId)
                if (!role) role = "No role set"
                messageChannel = message.guild.channels.cache.get(verificationData.messageChannelId)
                if (!messageChannel)
                messageChannel = "No message channel set"
                text = verificationData.message
                if (!text) text = "No text set"
            }
            if (!role) role = "No role set"
            if (!messageChannel) messageChannel = "No message channel set"
            if (!text) text = "No text set"
            if (channelData) {
                verificationChannel = message.guild.channels.cache.get(channelData.acceptChannel)
            }
            if (!verificationChannel) verificationChannel = "No verification channel set"
            await message.channel.send(
                new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTitle('Server Verification Settings')
                .addField('Verification Channel', verificationChannel, true)
                .addField('Message Channel', messageChannel, true)
                .addField('Role', role, true)
                .addField('Message', text, false)
                .setColor('AQUA')
            )
        }
        else {
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:redTick:792047662202617876> Please use the correct syntax - "[prefix]${this.name} ${this.usage}"`)
                .setColor('RED')
            )
        }
    }
}