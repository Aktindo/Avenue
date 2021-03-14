const randomizeCase = word => word.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
module.exports = {
	name: 'randomize',
	aliases: ['randomize-character', 'randomise'],
	usage: '<text>',
	description: 'SeEms GoOd!',
	category: 'Miscellaneous',
	cooldown: 5,
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
	async execute(client, message, args) {
		if (!args.length) {
			return message.channel.send(
				client.embedError(message, 'Please provide some text to randomize!'),
			);
		}
		await message.delete();
		message.channel.send(
			args.map(randomizeCase).join(' '),
		);
	},
};