const { MessageEmbed } = require('discord.js')
const messageCountModel = require('../../models/user-messagecount-model')
module.exports = {
    name: "userinfo",
    description: "Displays some information on the user!",
    aliases: ["ui", 'whois', 'whoami'],
    category: "Information",
    cooldowns: 5,
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    guildOnly: true,
    async execute(client, message, args) {
        const moment = require("moment");
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        const userStatus = () => {
            switch (member.user.presence.status) {
                case "online":
                    return "<:online:794157545244852244> Online";
                    case "idle":
                        return "<:idle:794157544397340702> Idle";
                        case "dnd":
                            return "<:dnd:794157544552923136> DND";
                            case "offline":
                                return "<:invisible:794157545383002152> Offline";
                                default:
                                    return "This user's status is not cached in the bot's data";
            }
        }
        const messageCountRes = await messageCountModel.findOne({
            guildId: message.guild.id,
            userId: member.id,
        })
        let messageCount
        if (!messageCountRes) messageCount = 0
        else {
            messageCount = messageCountRes.messageCount
        }
        let memberRoles
        if (member.roles.cache.size > 15) memberRoles = "Too many roles to display"
        else memberRoles = member.roles.cache.map(r => r).join(', ')
        const userinfo = new MessageEmbed()
        .setAuthor(member.user.username, member.user.displayAvatarURL({dynamic: true}))
        .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
        .addField('Registered', `${moment(member.user.createdAt).format('LLLL')}\n(${moment(member.user.createdAt).startOf('minutes').fromNow()})`, true)
        .addField('Joined', `${moment(member.joinedAt).format('LLLL')}\n(${moment(member.joinedAt).startOf('minutes').fromNow()})`, true)
        .addField('Status', `${userStatus()}`, false)
        .addField('Total Messages', messageCount, true)
        .addField(`Roles[${member.roles.cache.size}]`, memberRoles, false)
        .setColor('BLURPLE')
        message.channel.send(userinfo)
    }
}