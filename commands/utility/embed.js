const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'embed',
	description: 'Makes an embed.',
	category: 'Utility',
	aliases: ['announce', 'makeembed'],
	cooldown: 5,
	requiredPermissions: ['MANAGE_CHANNELS'],
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS', 'MANAGE_CHANNELS'],
	usage: '<...Title ...Description [color?hexcode]?seperatedBy(|)>',
	async execute(client, message, args) {
		const content = args.join(' ');
		if (!content) {
			return message.channel.send(
				client.embedError(message, 'Please provide some arguments.'),
			);
		}
		const splittedContent = content.split('|');
		const title = splittedContent[0];
		if (!title) {
			return message.channel.send(
				client.embedError(message, 'Invalid arguments given.'),
			);
		}
		if (title.length > 128) {
			return message.channel.send(
				client.embedError(message, 'A title cannot be longer than 128 characters.'),
			);
		}
		const description = splittedContent[1];
		if (!description) {
			return message.channel.send(
				client.embedError(message, 'Invalid arguments given.'),
			);
		}
		if (description.length > 1024) {
			return message.channel.send(
				client.embedError(message, 'A description cannot be longer than 1024 characters.'),
			);
		}
		let color = splittedContent[2];
		if (!color) color = 'BLURPLE';

		const embed = new MessageEmbed()
			.setColor(color)
			.setThumbnail(message.guild.iconURL({ dynamic: true, format: 'png' }))
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle(title)
			.setDescription(description)
			.setFooter(`In ${message.guild.name}`, client.user.displayAvatarURL({ dynamic: true }));

		message.channel.send(embed);
	},
};