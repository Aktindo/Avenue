require('dotenv').config()
const DiscordJS = require('discord.js')
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
module.exports = (client, message) => {
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(process.env.prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return

    let { botOwners } = require('../config/config.json')

    if (command.botOwnerOnly && !botOwners.includes(message.author.id)) {
        return message.channel.send('Only the bot owner can run this command.')
    }

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.permissions) {
        if (!message.member.hasPermission(command.permissions)) {
            return message.channel.send('You do not have enough permissions to run that command.')
        }
    }
    
    if (command.args && !args.length) {
        let reply = `Incorrect syntax! Please provide some more arguments, <@${message.author.id}>`
        
        if (command.usage) {
            reply += `\nThe proper usage would be - \`${process.env.prefix}${command.name} ${command.usage}\``
        }

        return message.channel.send(reply)
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
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(client, message, args)
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
}