const DiscordJS = require('discord.js');
const sentiment = require('sentiment');
const Sentiment = new sentiment();
const util = require('util');
module.exports = {
	name: 'analyze',
	aliases: ['analyse'],
	description: 'Analyzes a certain argument(s).',
	category: 'System',
	cooldown: 5,
	usage: '<...args>',
	botOwnerOnly: true,
	guildOnly: true,
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
	async execute(client, message, args) {
		const textToAnalyze = args.join(' ');
		if (!textToAnalyze) {
			return message.channel.send(
				client.embedError(message, 'Invalid arguments given!'),
			);
		}
		const analyze = Sentiment.analyze(textToAnalyze);
		const embed = new DiscordJS.MessageEmbed()
			.setTitle(`Overall Result: ${analyze.score}`)
			.setDescription(`**Detailed Information:**\n\`\`\`js\n${util.inspect(analyze)}\`\`\``)
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());

		if (analyze.score == 0) embed.setColor('YELLOW');
		else if (analyze.score > 0) embed.setColor('GREEN');
		else if (analyze.score < 0) embed.setColor('RED');
		message.channel.send(embed);
	},
};