const { MessageEmbed } = require("discord.js")
const moment = require('moment');
const guildChannelsModel = require("../models/guild-channels-model");
const guildStarboardModel = require("../models/guild-starboard-model");
module.exports = async client => {
    client.on('messageReactionAdd', async (reaction, user) => {
        const channelData = await guildChannelsModel.findOne({
            guildId: reaction.message.guild.id
        })
        const starData = await guildStarboardModel.findOne({
            guildId: reaction.message.guild.id
        })
        const handleStarboard = async () => {
            if (!channelData || !channelData.starboardChannel) return
            const starboard = client.channels.cache.get(channelData.starboardChannel)
            if (!starboard) return
            const msgs = await starboard.messages.fetch({ limit: 100 });
            const existingMsg = msgs.find(msg => {
                msg.embeds.length === 1 ?
                (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false
            })
            if (starData) {
                if (starData.minStars) {
                    if (reaction.count < starData.minStars) return
                }
            }
            if(existingMsg) existingMsg.edit(`${reaction.count} ⭐ | ${reaction.message.channel}`);
            else {
                const image = reaction.message.attachments.size > 0 ? await extension(reaction, reaction.message.attachments.array()[0].url) : '';
                const embed = new MessageEmbed()
                .setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
                .setImage(image)
                .setColor('#ffac33')
                .setDescription(`${reaction.message.content}`)
                .setFooter(reaction.message.id + ' | ' + moment(reaction.message.createdTimestamp).calendar());
                if (!starData || starData.showJumpLink == false) {
                    embed.addField('Source', 'Disabled', false)
                } else {
                    embed.addField('Source', `[Jump](${reaction.message.url})`, false)
                }
                if(starboard)
                    starboard.send(`${reaction.count} ⭐ | ${reaction.message.channel}`, embed);
            }
        }
        if(reaction.emoji.name === '⭐') {
            if(reaction.message.channel.id == channelData.starboardChannel) return;
            if(reaction.message.partial) {
                await reaction.fetch();
                await reaction.message.fetch();
                handleStarboard();
            }
            else
                handleStarboard();
        }
    });
    
    client.on('messageReactionRemove', async (reaction, user) => {
        const data = await guildChannelsModel.findOne({
            guildId: reaction.message.guild.id
        })
        const handleStarboard = async () => {
            const starboard = client.channels.cache.find(channel => channel.name.toLowerCase() === 'starboard');
            const msgs = await starboard.messages.fetch({ limit: 100 });
            const existingMsg = msgs.find(msg => 
                msg.embeds.length === 1 ? 
                (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
            if(existingMsg) {
                if(reaction.count === 0)
                    existingMsg.delete({ timeout: 2500 });
                else
                    existingMsg.edit(`${reaction.count} ⭐ | ${reaction.message.channel}`)
            };
        }
        if(reaction.emoji.name === '⭐') {
            if(reaction.message.channel.id == data.starboardChannel) return;
            if(reaction.message.partial) {
                await reaction.fetch();
                await reaction.message.fetch();
                handleStarboard();
            }
            else
                handleStarboard();
        }
    });
}

async function extension(reaction, attachment) {
    const imageLink = attachment.split('.');
    const typeOfImage = imageLink[imageLink.length - 1];
    const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
    if (!image) return '';
    return attachment;
}