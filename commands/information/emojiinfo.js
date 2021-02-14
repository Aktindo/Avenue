const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "emojinfo",
    description: "Displays some information on a emoji!",
    aliases: ["emoji", "steal"],
    category: "Information",
    usage: "<emoji>",
    cooldowns: 5,
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    guildOnly: true,
    async execute(client, message, args) {
        function getEmoji(message) {
            const emojiId = message.replace(/<a?:(.*?):+/g, '').replace(/>+/g, '');
            let imageUrl = `https://cdn.discordapp.com/emojis/${emojiId}`;
            let animated = true;
            if (message.indexOf('<a:') === 0) {
                imageUrl += '.gif';
            } else if (message.indexOf('<:') === 0) {
                imageUrl += '.png';
                animated = false;
            } else {
                throw Error("That is not an emoji");
            }
        
            return [animated, imageUrl, emojiId];
        }

        const emoji = args[0]
        if (!emoji) return message.channel.send(
            client.embedError(message, 'Please provide a valid emoji!')
        )

        const embed = new MessageEmbed()
        try {
            const [animated, imageUrl] = getEmoji(emoji);
            embed.setImage(imageUrl);
            embed.setColor('BLURPLE') 
            if (animated) {
                embed.setDescription(`[GIF](${imageUrl})`);
            } else {
                embed.setDescription(`[PNG](${imageUrl})`);
            }
        } catch {
            message.channel.send(
                client.embedError(message, 'Fatal error while fetching emoji.')
            );
        }
        message.channel.send(embed)
    }
}