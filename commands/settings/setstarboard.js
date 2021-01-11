const { MessageEmbed } = require('discord.js')
const guildChannelsModel = require('../../models/guild-channels-model')
const guildStarboardModel = require('../../models/guild-starboard-model')
module.exports = {
    name: "setstarboard",
    description: "Sets a starboard's settings!",
    category: "Settings",
    cooldowns: 5,
    usage: "<enable|disable>|<minStars|allowNsfw|allowSource>|<--settings> [number]|[true|false]",
    requiredPermissions: ['VIEW_AUDIT_LOG'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    guildOnly: true,
    async execute(client, message, args) {
        if (!args[0]) {
            return message.channel.send(
                client.embedError(message, `Invalid arguments given.\nPlease see \`[prefix]help setstarboard\` for more information on how to use this command.`)
            )
        }
        if (args[0].toLowerCase() == 'enable') {
            const data = await guildStarboardModel.findOne({
                guildId: message.guild.id
            })
            if (!data || !data.enabled) {
                await guildStarboardModel.findOneAndUpdate({
                    guildId: message.guild.id
                }, {
                    guildId: message.guild.id,
                    enabled: true
                }, {
                    upsert: true
                })
                message.channel.send(
                    client.embedSuccess(message, "Successfully enabled the starboard.")
                )
            } else if (data.enabled == true) {
                message.channel.send(
                    client.embedError(message, "The starboard is already enabled.")
                )
            }
        }
        else if (args[0].toLowerCase() == 'disable') {
            const data = await guildStarboardModel.findOne({
                guildId: message.guild.id
            })
            if (!data || data.enabled) {
                await guildStarboardModel.findOneAndUpdate({
                    guildId: message.guild.id
                }, {
                    guildId: message.guild.id,
                    enabled: false
                }, {
                    upsert: true
                })
                message.channel.send(
                    client.embedSuccess(message, "Successfully disabled the starboard.")
                )
            } else if (data.enabled == false) {
                message.channel.send(
                    client.embedError(message, "The starboard is already disabled.")
                )
            }
        }
        else if (args[0].toLowerCase() == 'minstars') {
            let limit = parseInt(args[1])
            if (!limit) {
                return message.channel.send(
                    client.embedError(message, "Please provide the number of minimum stars!")
                )
            }
            if (limit < 0) {
                return message.channel.send(
                    client.embedError(message, "Cannot parse an integer < 0.")
                )
            }
            if (limit > 25) {
                return message.channel.send(
                    client.embedError(message, "Cannot parse an integer > 25.")
                )
            }

            await guildStarboardModel.findOneAndUpdate({
                guildId: message.guild.id,
            }, {
                guildId: message.guild.id,
                minStars: limit,
            }, {
                upsert: true
            })

            message.channel.send(
                client.embedSuccess(message, `Successfully set ${limit} as the mimum limit for starred messages to be accepted.`)
            )
        }
        else if (args[0].toLowerCase() == 'allowsource') {
            const data = await guildStarboardModel.findOne({
                guildId: message.guild.id
            })
            if (!args[1]) {
                return message.channel.send(
                    client.embedError(message, 'Invalid arguments given.')
                )
            }
            if (args[1].toLowerCase() == 'true') {
                if (!data || !data.showJumpLink) {
                    await guildStarboardModel.findOneAndUpdate({
                        guildId: message.guild.id
                    }, {
                        guildId: message.guild.id,
                        showJumpLink: true
                    }, {
                        upsert: true
                    })
                    message.channel.send(
                        client.embedSuccess(message, "Successfully enabled the source link for any starred message.")
                    )
                } else if (data.showJumpLink == true) {
                    message.channel.send(
                        client.embedError(message, "The source link for any starred message is already enabled.")
                    )
                }
            }
            else if (args[1].toLowerCase() == 'false') {
                const data = await guildStarboardModel.findOne({
                    guildId: message.guild.id
                })
                if (!data || data.showJumpLink) {
                    await guildStarboardModel.findOneAndUpdate({
                        guildId: message.guild.id
                    }, {
                        guildId: message.guild.id,
                        showJumpLink: false
                    }, {
                        upsert: true
                    })
                    message.channel.send(
                        client.embedSuccess(message, "Successfully disabled the source link for any starred message.")
                    )
                } else if (data.showJumpLink == false) {
                    message.channel.send(
                        client.embedError(message, "The source link for any starred message is already disabled.")
                    )
                }
            }
        }
        else if (args[0].toLowerCase() == '--settings') {
            const starData = await guildStarboardModel.findOne({
                guildId: message.guild.id
            })
            const channelData = await guildChannelsModel.findOne({
                guildId: message.guild.id
            })
            let starboardChannel
            let minStars 
            let showJumpLink
            if (!channelData || !channelData.starboardChannel) {
                starboardChannel = "No starboard channel"
            } else {
                const channel = message.guild.channels.cache.get(channelData.starboardChannel)
                if (!channel) starboardChannel = "No starboard channel"
                else starboardChannel = channel
            }
            if (!starData || !starData.minStars) {
                minStars = "1"
            } else {
                minStars = starData.minStars
            }
            if (!starData || !starData.showJumpLink) {
                showJumpLink = "Yes"
            } else {
                switch (starData.showJumpLink) {
                    case true:
                        showJumpLink = "Yes"
                    case false: 
                        showJumpLink = "No"
                    default:
                        "Yes"
                }
            }
            const embed = new MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setTitle('Starboard Settings')
            .addField('Channel', starboardChannel)
            .addField('Minimum Stars', minStars)
            .addField('Allow Source', showJumpLink)
            .setColor('BLURPLE')
            message.channel.send(embed)
        }
    }
}