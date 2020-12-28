require('dotenv').config()
const DiscordJS = require('discord.js')
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const guildRoleModel = require('../models/guild-roles-model')
const messageCountModel = require('../models/user-messagecount-model')
const {MessageEmbed} = require('discord.js')
module.exports = async (client, message) => {
    if (message.author.bot) return
    if (!message.guild) return
    await messageCountModel.findOneAndUpdate({
        guildId: message.guild.id,
        userId: message.author.id,
    }, {
        guildId: message.guild.id,
        userId: message.author.id,
        $inc: {
            messageCount: 1
        }
    }, {
        upsert: true
    })
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(process.env.prefix)})\\s*`);
    if (!prefixRegex.test(message.content.toLowerCase())) return;

    const [, matchedPrefix] = message.content.toLowerCase().match(prefixRegex);

	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return

    let { botOwners } = require('../config/config.json')

    if (command.botOwnerOnly && !botOwners.includes(message.author.id)) {
        return message.channel.send(
            new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription('<:redTick:792047662202617876> Only the bot owner can run this command!')
            .setColor('RED')
        )
    }

    if (command.botPermissions) {
        if (!message.guild.me.hasPermission(command.botPermissions)) {
            return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription(`<:redTick:792047662202617876> I do not have the required permissions - \`${command.botPermissions.join(', ')}\` to run that command in this server!`)
                .setColor('RED')
            )
        }
    }

    if (command.requiredPermissions) {
        if (!message.member.hasPermission(command.requiredPermissions)) {
            return message.channel.send(
                new MessageEmbed()
                .setAuthor(message.author.username)
                .setDescription('<:redTick:792047662202617876> You do not have the required roles/permissions to run that command.')
                .setColor('RED')
            )
        }
    }

    const cooldowns = new DiscordJS.Collection()

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new DiscordJS.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(
                    new MessageEmbed()
                    .setAuthor(message.author.username)
                    .setDescription(`<:redTick:792047662202617876> The command \`${command.name}\` is on cooldown.\nYou can use it again in \`${timeLeft}s\`!`)
                    .setColor('RED')
                );
            }
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(client, message, args)
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!\nYou should not receive an error like this.\nPlease join the support server!');
	}
}