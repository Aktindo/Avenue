module.exports = {
	name: 'hide',
	description: 'Hides a channel from a user.',
	category: 'Moderation',
	cooldown: 5,
	usage: '<user> [reason]',
	requiredPermissions: ['MANAGE_CHANNELS'],
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS', 'MANAGE_CHANNELS'],
	async execute(client, message, args) {
		const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!user) {
			return message.channel.send(
				client.embedError(message, 'Please mention a valid user.'),
			);
		}
		if (user.hasPermission('ADMINISTRATOR')) {
			return message.channel.send(
				client.embedError(message, 'That user is a administrator.'),
			);
		}
		if (user.user.bot) {
			return message.channel.send(
				client.embedError(message, 'That user is a bot.'),
			);
		}
		message.channel.updateOverwrite(user, {
			VIEW_CHANNEL: false,
		}).then(
			message.channel.send(
				client.embedSuccess(message, `Successfully hid ${user} from ${message.channel}.`),
			),
		);
	},
};