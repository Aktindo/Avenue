const {MessageEmbed} = require('discord.js')
const guildChannelsModel = require('../../models/guild-channels-model')
const guildWelcomeModel = require('../../models/guild-welcome-model')
module.exports = {
    name: "setwelcome",
    description: "A command to set the welcome text and see server welcome settings",
    category: "settings",
    cooldowns: 5,
    aliases: ["welcome"],
    usage: "<text>|[--simjoin]|[--settings]",
    variables: ["{member}", "{server}", "{membercount}"],
    requiredPermissions: ['ADMINISTRATOR'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        const channelData = await guildChannelsModel.findOne({
            guildId: message.guild.id
        })
        const welcomeData = await guildWelcomeModel.findOne({
            guildId: message.guild.id
        })
        if (!args[0]) return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription(`<:redTick:792047662202617876> Invalid syntax! Please use \`[prefix]setwelcome ${this.usage}\``)
            .setColor('RED')
        )
        if (args[0].toLowerCase() === '--simjoin') {
            let channel
            if (channelData) {
                channel = message.guild.channels.cache.get(channelData.welcomeChannel)
                if (!channel) {
                    return message.channel.send(
                        new MessageEmbed()
                        .setAuthor(message.author.username)
                        .setDescription('<:redTick:792047662202617876> You cannot simulate the join right now because this server has no welcome channel set.')
                        .setColor('RED')
                    )
                }
            }
            if (!welcomeData) {
                return message.channel.send(
                    new MessageEmbed()
                    .setAuthor(message.author.username)
                    .setDescription('<:redTick:792047662202617876> You cannot simulate the join right now because this server has no welcome text set.')
                    .setColor('RED')
                )
            }
            client.emit('guildMemberAdd', message.member)
        }
        else if (args[0].toLowerCase() === '--settings') {
            let channel
            if (channelData) {
                channel = message.guild.channels.cache.get(channelData.welcomeChannel)
            }
            if (!channel) channel = "No channel set"
            let welcomeText
            if (welcomeData) {
                welcomeText = welcomeData.text
            }
            if (!welcomeData) {
                welcomeText = 'No text set'
            }
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTitle('Server Welcome Settings')
                .addField("Welcome Channel", channel, true)
                .addField('Welcome Text', welcomeText, true)
                .setColor('AQUA')
            )
        }
        else {
            let text = args.join(' ')
            if (!text) return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> Please provide some text!')
                .setColor('RED')
            )
            await guildWelcomeModel.findOneAndUpdate({
                guildId: message.guild.id
            }, {
                guildId: message.guild.id,
                text,
            }, {
                upsert: true
            })
            message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:greenTick:792047523803299850> Successfully set the \`welcome\` text!`)
                .setColor('GREEN')
            )   
        }
    }
}