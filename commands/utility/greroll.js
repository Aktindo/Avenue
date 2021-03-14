const { MessageEmbed } = require('discord.js')
const ms = require('ms')
module.exports = {
    name: "greroll",
    description: "Rerolls a giveaway in a channel.",
    category: "Utility",
    aliases: ['grr', 'giveawayreroll'],
    cooldown: 5,
    requiredPermissions: ['MANAGE_MESSAGES'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    usage: "<MessageID|Prize>",
    async execute(client, message, args) {
        if(!args[0]){
            return message.channel.send(
                client.embedError(message, 'Please provide a valid giveaway message ID.')
            );
        }
        let giveaway = 
        client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||        
        client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);
    
        
        if(!giveaway){
            return message.channel.send(
                client.embedError(message, `No giveaway found with the ID or prize - \`${args.join(' ')}\`.`)
            );
        }

        client.giveawaysManager.reroll(giveaway.messageID)
        
        .then(() => { 
            message.channel.send('Giveaway rerolled!');
        })
        .catch((e) => {
            if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
                message.channel.send(
                    client.embedError(message, 'That giveaway is not ended yet.')
                );
            } else {
                console.error(e);
                message.channel.send(
                    client.embedError(message, 'Failed to reroll the giveaway. Please report this error.')
                );
            }
        });
    }
}