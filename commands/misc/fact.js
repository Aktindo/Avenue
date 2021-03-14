const someRandomCat = require('some-random-cat').Random;
module.exports = {
	name: 'fact',
	description: 'Get a random fact!',
	category: 'Miscellaneous',
	cooldown: 5,
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
	async execute(client, message) {
		await someRandomCat.getFact()
			.then(res => {
				message.channel.send(res);
			})
			.catch(error => {
				message.channel.send(
					client.embedError(message, `Error while fetching response:\n${error}`),
				);
			});
	},
};