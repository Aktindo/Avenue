const { MessageEmbed } = require('discord.js');
const guildGeneralModel = require('../../models/guild-general-model');
require('dotenv').config();
module.exports = {
	name: 'help',
	description: 'A command which displays all the commands of the bot.',
	category: 'System',
	aliases: ['h', 'info'],
	cooldown: 5,
	usage: '[command_name]',
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
	async execute(client, message, args) {
		const data = await guildGeneralModel.findOne({
			_id: message.guild.id,
		});
		let prefix;
		if (!data || !data.prefix) {prefix = process.env.PREFIX || 'a!';}
		else {prefix = data.prefix;}
		const commandName = args.join('-');

		if (!commandName) {
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setThumbnail(client.user.displayAvatarURL({ format:'png', size: 4096 }))
				.setTitle('Help Menu')
				.addField('Here are the commands!', `If you want to view more information on a command, use \`${prefix}help [command_name]\``, false)
				.setColor('BLURPLE')
				.setTimestamp();

			const validCategories = [
				'Information',
				'Moderation',
				'Settings',
				'System',
				'Miscellaneous',
				'Utility',
			]
				.sort(
					function(a, b) {
						if (a < b) return -1;
						else if (a > b) return 1;
						return 0;
					},
				);

			validCategories.forEach((category) => {
				const validCommands = client.commands
					.filter((cmd) => cmd.category === category && !cmd.botOwnerOnly)
					.map((cmd) => `\`${cmd.name}\``)
					.join(', ');

				embed.addField(category, validCommands, false);
			});

			message.channel.send(embed);
		}
		else {
			const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));
			if (!command) {
				return message.channel.send(
					new MessageEmbed()
						.setAuthor(message.author.username)
						.setDescription('<:redTick:792047662202617876> I could not find that command!')
						.setColor('RED'),
				);
			}
			else {
				const helpEmbed = new MessageEmbed()
					.setAuthor(client.user.username, client.user.displayAvatarURL())
					.setColor('BLURPLE')
					.addField('Command', capitalizeFirstLetter(command.name), false);
				let commandUsage;
				if (command.usage) commandUsage = ` ${command.usage}`;
				else commandUsage = '';
				if (command.description) helpEmbed.addField('Description', command.description, false);
				if (command.aliases) helpEmbed.addField('Aliases', command.aliases.map(a => `\`${a}\``).join(', '), false);
				if (command.cooldown) helpEmbed.addField('Cooldowns', `User - ${command.cooldown}s`);
				helpEmbed.addField('Usage', `\`${process.env.prefix}${command.name}${commandUsage}\``);
				if (command.requiredPermissions) {
					const permissions = command.requiredPermissions.map(p => capitalizeFirstLetter(p).split('_').join(' ')).join(', ');
					helpEmbed.addField('Permissions Required', permissions, false);
				}
				if (command.botPermissions) {
					const permissions = command.botPermissions.map(p => capitalizeFirstLetter(p).split('_').join(' ')).join(', ');
					helpEmbed.addField('Permissions Required by Bot', permissions, false);
				}
				helpEmbed.addField('Additional Note', 'Arguments that are wrapped with `<>` like `<query>` are required.\nArguments that are wrapped with `[]` like `[query]` are optional.\nA `|` after the argument means you can use either of the two arguments.\nArguments that end with a `?` have to be followed by the rule after it. Example - `<time?rule>`\nAny Argument enclosed in `()` need to be applied for the `?` rule. Example - `<time?endsWith(s|m|h)`\nAny argument enclosed in `{}` after an argument means you can include that variable in the argument to create dynamic stuff. Example - <welcomeMessage{user|server}>');
				message.channel.send(helpEmbed);
			}
		}
	},
};

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}