module.exports = {
	name: 'invite',
	description: 'The invite link to invite the bot to your server',
	category: 'System',
	cooldown: 5,
	aliases: ['inv'],
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
	async execute(client, message) {
		return message.channel.send(
			client.embedSuccess(message, 'If you want to use me in your server(s), click [here](https://discord.com/oauth2/authorize?client_id=790198442668064789&scope=bot&permissions=8)'),
		);
	},
};