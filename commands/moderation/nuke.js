const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "nuke",
    description: "Deletes the channel and clones it to delete all of the channel's messages.",
    category: "Moderation",
    cooldowns: 5,
    requiredPermissions: ['MANAGE_CHANNELS'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "MANAGE_CHANNELS"],
    async execute(client, message, args) {
        const filter = m => {
            return m.author.id == message.author.id
        }
        message.channel.send("Are you sure? Reply with `yes` or `no` within 15 seconds.").then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
                .then(async collected => {
                    if (collected.first().content.toLowerCase() == 'yes') {
                        const newChannel = await message.channel.clone()
                        message.channel.delete('Nuking the channel because of request.')
                        newChannel.send('I am first!')
                    } else {
                        return message.channel.send(
                            client.embedError(message, 'Cancelled the nuking of channel. Reason - **Denied**')
                        )
                    }
                })
                .catch(collected => {
                    message.channel.send(
                        client.embedError(message, 'Cancelled the nuking of channel. Reason - **Too slow**')
                    );
                });
        });
    }
}