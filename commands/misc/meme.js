const { MessageEmbed } = require('discord.js');
const someRandomCat = require('some-random-cat').Random;
module.exports = {
	name: 'meme',
	description: 'Get a random meme!',
	category: 'Miscellaneous',
	cooldown: 5,
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
	async execute(client, message) {
		const subreddits = [
			'meme',
			'dankmemes',
			'danidev',
		];
		const randomSubReddit = subreddits[Math.floor(Math.random() * subreddits.length)];
		await someRandomCat.getMeme(randomSubReddit)
			.then(res => {
				message.channel.send(
					new MessageEmbed()
						.setTitle(res.title)
						.setURL(`https://www.reddit.com/r/${randomSubReddit}`)
						.setImage(res.img)
						.setFooter(`👍 ${res.upvotes} | 💬 ${res.comments}`)
						.setAuthor(`From ${res.author}`)
						.setColor('RANDOM'),
				);
			})
			.catch(error => {
				message.channel.send(
					client.embedError(message, `Error while fetching response:\n${error}`),
				);
			});
	},
};