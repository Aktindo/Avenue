module.exports = {
	name: 'space',
	usage: '<text>',
	description: 'Just like clapify but you can provide your own emoji!',
	category: 'Miscellaneous',
	cooldown: 5,
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
	async execute(client, message, args) {
		const emoji = args[0];
		if (!emoji) {
			return message.channel.send(
				client.embedError(message, 'Please provide a valid emoji.'),
			);
		}
		const text = args.join(emoji).slice(1);
		if (!text) {
			return message.channel.send(
				client.embedError(message, 'Please provide some valid text.'),
			);
		}
		await message.delete();
		message.channel.send(
			text,
		);
	},
};