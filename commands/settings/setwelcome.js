const { MessageEmbed } = require('discord.js');
const guildChannelsModel = require('../../models/guild-channels-model');
const guildWelcomeModel = require('../../models/guild-welcome-model');
module.exports = {
	name: 'setwelcome',
	description: 'A command to set the welcome text and see server welcome settings',
	category: 'Settings',
	cooldown: 5,
	aliases: ['welcome'],
	usage: '<text{user|server|membercount}>|[--simjoin]|[--settings]',
	variables: ['{member}', '{server}', '{membercount}'],
	requiredPermissions: ['ADMINISTRATOR'],
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
	async execute(client, message, args) {
		const channelData = await guildChannelsModel.findOne({
			guildId: message.guild.id,
		});
		const welcomeData = await guildWelcomeModel.findOne({
			guildId: message.guild.id,
		});
		if (!args[0]) {
			return message.channel.send(
				client.embedError(message, `Invalid Syntax!\nPlease use \`[prefix]${this.name} ${this.usage}\``),
			);
		}
		if (args[0].toLowerCase() === '--simjoin') {
			const channel = message.guild.channels.cache.get(channelData.welcomeChannel);
			if (channel && welcomeData.text) {
				client.emit('guildMemberAdd', message.member);
			}
			else {
				return message.channel.send(
					client.embedError(message, `You cannot simulate the welcome as there is no welcome channel/text set.\nPlease use \`[prefix]${this.name} --settings\` to view the server welcome settings.`),
				);
			}
		}
		else if (args[0].toLowerCase() === '--settings') {
			let channel;
			if (channelData) {
				channel = message.guild.channels.cache.get(channelData.welcomeChannel);
			}
			if (!channel) channel = 'No channel set';
			let welcomeText;
			if (welcomeData) {
				welcomeText = welcomeData.text;
			}
			if (!welcomeData) {
				welcomeText = 'No text set';
			}
			const embed = new MessageEmbed()
				.setAuthor(message.guild.name, message.guild.iconURL())
				.setTitle('Welcome Settings')
				.addField('Channel', channel, true)
				.addField('Text', welcomeText, true)
				.setColor('BLURPLE');
			message.channel.send(embed);
		}
		else {
			const text = args.join(' ');
			if (!text) {
				return message.channel.send(
					client.embedError(message, `Invalid Syntax!\nPlease use \`[prefix]${this.name} ${this.usage}\``),
				);
			}
			if (text.length > 1024) {
				return message.channel.send(
					client.embedError(message, `The verification message cannot be longer than 1024 characters.\nYou provided (${text.length}/1024)`),
				);
			}
			await guildWelcomeModel.findOneAndUpdate({
				guildId: message.guild.id,
			}, {
				guildId: message.guild.id,
				text,
			}, {
				upsert: true,
			});
			message.channel.send(
				client.embedSuccess(message, 'Successfully set the `welcome` text!'),
			);
		}
	},
};