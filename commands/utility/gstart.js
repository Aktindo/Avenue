const { MessageEmbed } = require('discord.js')
const ms = require('ms')
module.exports = {
    name: "gstart",
    description: "Starts a giveaway in a channel.",
    category: "Utility",
    aliases: ['gcreate', 'giveawaystart'],
    cooldowns: 5,
    requiredPermissions: ['MANAGE_MESSAGES'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    usage: "<Channel?(ID|Mention)> <Duration?endsWith(s|m|h|d|w|m|y)> <Winners?number> <Prize>",
    async execute(client, message, args) {
        let giveawayChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if(!giveawayChannel){
            return message.channel.send(
                client.embedError(message, 'Please provide a valid channel.')
            );
        }

        let giveawayDuration = args[1];
        if(!giveawayDuration || isNaN(ms(giveawayDuration))){
            return message.channel.send(
                client.embedError(message, 'Please provide a valid duration.')
            );
        }

        let giveawayNumberWinners = args[2];
        if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
            return message.channel.send(
                client.embedError(message, 'Please provide valid number of winners.')
            );
        }

        let giveawayPrize = args.slice(3).join(' ');
        if(!giveawayPrize){
            return message.channel.send(
                client.embedError(message, 'Please provide a valid prize.')
            );
        }

        client.giveawaysManager.start(giveawayChannel, {
            time: ms(giveawayDuration),
            prize: giveawayPrize,           
            winnerCount: giveawayNumberWinners,            
            hostedBy: client.config.hostedBy ? message.author : null,            
            messages: {
                giveaway: (client.config.everyoneMention ? "@everyone\n\n" : "")+"🎉 **GIVEAWAY** 🎉",
                giveawayEnded: (client.config.everyoneMention ? "@everyone\n\n" : "")+"🎉 **GIVEAWAY ENDED** 🎉",
                timeRemaining: "Time remaining: **{duration}**!",
                inviteToParticipate: "React with 🎉 to participate!",
                winMessage: `🎉 Congratulations, {winners}! You won **{prize}**!\n{messageURL}`,
                embedFooter: "Giveaways",
                noWinner: "Giveaway cancelled, no valid participations.",
                hostedBy: "Hosted by: {user}",
                winners: "winner(s)",
                endedAt: "Ended at",
                units: {
                    seconds: "seconds",
                    minutes: "minutes",
                    hours: "hours",
                    days: "days",
                    pluralS: false 
                }
            }
        });

        message.channel.send(
            client.embedSuccess(message, `A giveaway has been started in ${giveawayChannel}!`)
        );
    }
}