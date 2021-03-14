const { MessageEmbed } = require('discord.js');
const guildChannelsModel = require('../../models/guild-channels-model');
const guildVerificationSystemModel = require('../../models/guild-verification-system-model');

module.exports = {
	name: 'setverification',
	description: 'Set all the verification system you need in your server!',
	aliases: ['verification'],
	category: 'Settings',
	usage: '<role|messagechannel|message{user|server|membercount}>|[--info|--settings] <<role|ID>|<channel|ID>|<message>>',
	cooldown: 5,
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
	requiredPermissions: ['ADMINISTRATOR'],
	variables: ['{member}', '{server}', '{membercount}'],
	async execute(client, message, args) {
		if (!args[0]) {
			return message.channel.send(
				client.embedError(message, `Invalid syntaxx!\nPlease use [prefix]${this.name} ${this.usage}`),
			);
		}
		if (args[0].toLowerCase() == 'role') {
			const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
			if (!role) {
				return message.channel.send(
					client.embedError(message, 'No role found with that mention or ID.'),
				);
			}

			await guildVerificationSystemModel.findOneAndUpdate({
				guildId: message.guild.id,
			}, {
				guildId: message.guild.id,
				roleId: role.id,
			}, {
				upsert: true,
			});
			message.channel.send(
				client.embedSuccess(message, `Successfully set ${role} as the verification \`role\`.`),
			);
		}
		else if (args[0].toLowerCase() == 'messagechannel') {
			const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
			if (!channel) {
				return message.channel.send(
					client.embedError(message, 'No channel found with that mention or ID.'),
				);
			}
			await guildVerificationSystemModel.findOneAndUpdate({
				guildId: message.guild.id,
			}, {
				guildId: message.guild.id,
				messageChannelId: channel.id,
			}, {
				upsert: true,
			});
			message.channel.send(
				client.embedSuccess(message, `Successfully set ${channel} as the verification \`messagechannel\`.`),
			);
		}
		else if (args[0].toLowerCase() == 'message') {
			const text = args.slice(1).join(' ');
			if (!text) {
				return message.channel.send(
					client.embedError(message, 'Please provide a verification message.'),
				);
			}
			if (text.length > 1024) {
				return message.channel.send(
					client.embedError(message, `The verification message cannot be longer than 1024 characters.\nYou provided (${text.length}/1024)`),
				);
			}
			await guildVerificationSystemModel.findOneAndUpdate({
				guildId: message.guild.id,
			}, {
				guildId: message.guild.id,
				message: text,
			}, {
				upsert: true,
			});
			message.channel.send(
				client.embedSuccess(message, 'Successfully set the verification `message`.'),
			);
		}
		else if (args[0].toLowerCase() == '--info') {
			message.channel.send(
				client.embedSuccess(message, 'Hey there, seems like you wanna setup a verification system.\nWe are currently working on the dashboard and will release it as soon as we finish!\nTo get help setting up the system, please join this [server](https://discord.gg/xSQMdPEvHt)\nThanks!'),
			);
		}
		else if (args[0].toLowerCase() == '--settings') {
			const verificationData = await guildVerificationSystemModel.findOne({
				guildId: message.guild.id,
			});
			const channelData = await guildChannelsModel.findOne({
				guildId: message.guild.id,
			});
			let verificationChannel;
			let role;
			let messageChannel;
			let text;
			if (verificationData) {
				role = message.guild.roles.cache.get(verificationData.roleId);
				if (!role) role = 'No role set';
				messageChannel = message.guild.channels.cache.get(verificationData.messageChannelId);
				if (!messageChannel) {messageChannel = 'No message channel set';}
				text = verificationData.message;
				if (!text) text = 'No text set';
			}
			if (!role) role = 'No role set';
			if (!messageChannel) messageChannel = 'No message channel set';
			if (!text) text = 'No text set';
			if (channelData) {
				verificationChannel = message.guild.channels.cache.get(channelData.acceptChannel);
			}
			if (!verificationChannel) verificationChannel = 'No verification channel set';
			await message.channel.send(
				new MessageEmbed()
					.setAuthor(message.guild.name, message.guild.iconURL())
					.setTitle('Server Verification Settings')
					.addField('Verification Channel', verificationChannel, true)
					.addField('Message Channel', messageChannel, true)
					.addField('Role', role, true)
					.addField('Message', text, false)
					.setColor('BLURPLE'),
			);
		}
		else {
			message.channel.send(
				client.embedError(message, `Incorrect syntax!\nPlease use [prefix]${this.name} ${this.usage}`),
			);
		}
	},
};