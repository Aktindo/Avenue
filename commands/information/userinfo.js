const { MessageEmbed } = require('discord.js')
const messageCountModel = require('../../models/user-messagecount-model')
const guildRoleModel = require('../../models/guild-roles-model')
module.exports = {
    name: "userinfo",
    description: "Displays some information on the user!",
    aliases: ["ui", 'whois', 'whoami'],
    category: "information",
    cooldowns: 5,
    async execute(client, message, args) {
        const moment = require("moment");
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        const userStatus = () => {
            switch (member.user.presence.status) {
                case "online":
                    return "<a:online:781384162195668994> Online";
                    case "idle":
                        return "<a:idle:781384162527412234> Idle";
                        case "dnd":
                            return "<a:dnd:781384163420536902> DND";
                            case "offline":
                                return "<a:offline:781384295825670155> Offline";
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
        const userinfo = new MessageEmbed()
        .setAuthor(member.user.username, member.user.displayAvatarURL({dynamic: true}))
        .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
        .addField('Registered', `${moment(member.user.createdAt).format('LLLL')}\n(${moment(member.user.createdAt).startOf('minutes').fromNow()})`, true)
        .addField('Joined', `${moment(member.joinedAt).format('LLLL')}\n(${moment(member.joinedAt).startOf('minutes').fromNow()})`, true)
        .addField('Status', `${userStatus()}`, false)
        .addField('Total Messages', messageCount, true)
        .addField(`Roles[${member.roles.cache.size}]`, member.roles.cache.map(r => r).join(', '), false)
        .setColor('AQUA')
        message.channel.send(userinfo)
    }
}