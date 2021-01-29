require('dotenv').config()
const DiscordJS = require('discord.js')
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const guildRoleModel = require('../models/guild-roles-model')
const messageCountModel = require('../models/user-messagecount-model')
const {MessageEmbed} = require('discord.js');
const guildGeneralModel = require('../models/guild-general-model');
const logs = require('../models/logs');
module.exports = async (client, message) => {
    const {botOwners} = require('../config/config.json')
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
    await logs.add(message.guild.id, 'messages')
    let prefix = ""
    const savedGuild = await guildGeneralModel.findOne({
        _id: message.guild.id
    })
    if (!savedGuild || !savedGuild.prefix) prefix = "."
    else prefix = savedGuild.prefix
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content.toLowerCase())) return;

    const [, matchedPrefix] = message.content.toLowerCase().match(prefixRegex);

	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return

    let commandChannel
    if (!savedGuild || !savedGuild.commandChannel || savedGuild.commandChannel == "No Channel") commandChannel = null
    else commandChannel = client.channels.cache.get(savedGuild.commandChannel)

    if (commandChannel && command.commandChannelOnly !== false) {
        if (message.channel.id != commandChannel.id && !message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.channel.send(
                client.embedError(message, `You can use commands only in ${commandChannel}`)
            )
        }    
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

    if (command.botOwnerOnly && !botOwners.includes(message.author.id)) {
        return message.channel.send(
            client.embedError(message, "Only the bot owner can run that command!")
        )
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
    const cooldowns = new DiscordJS.Collection();

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new DiscordJS.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(
                client.embedError(message, `That command is on cooldown.\nPlease wait ${timeLeft.toFixed(1)}s before using that command again.`)
            )
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
        command.execute(client, message, args)
        await logs.add(message.guild.id, 'commands')
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!\nYou should not receive an error like this.\nPlease join the support server!');
    }
}