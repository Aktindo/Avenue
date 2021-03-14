const { MessageEmbed } = require('discord.js')
const moment = require('moment')
module.exports = {
    name: "glist",
    description: "Lists all the active giveaways in the server.",
    category: "Utility",
    aliases: ['giveawaylist'],
    cooldown: 5,
    requiredPermissions: ['MANAGE_MESSAGES'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        let allGiveaways = client.giveawaysManager.giveaways.filter((g) => (g.guildID === message.guild.id && !g.ended));
        const embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle('All Active Giveaways')
        .setDescription('These are all the active giveaways. If you see none, there are no giveaways running.')
        .setFooter(client.user.username, client.user.displayAvatarURL({ format: "png" }))
        .setColor('BLURPLE')

        allGiveaways.forEach(giveaway => {
            embed.addField(`Giveaway ID - ${giveaway.messageID}`, `**Hosted By:** ${giveaway.hostedBy}\n**Prize:** ${giveaway.prize}\n**Started:** ${moment(giveaway.startAt).fromNow()}\n**Ends at:** ${moment(giveaway.endAt).calendar()}\n**Winners:** ${giveaway.winnerCount}`)
        })

        message.channel.send(embed)
    }
}