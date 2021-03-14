const warningModel = require('../../models/warning-system-model');
const reportSystemModel = require('../../models/report-system-model');
const banSystemModel = require('../../models/ban-system-model');
const kickSystemModel = require('../../models/kick-system-model');
module.exports = {
	name: 'editcase',
	description: 'Edits an existing case of a user.',
	category: 'Moderation',
	cooldown: 5,
	usage: '<case_number> [reason]',
	requiredPermissions: ['VIEW_AUDIT_LOG'],
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
	guildOnly: true,
	async execute(client, message, args) {
		const _caseNumber = args[0];
		if (isNaN(_caseNumber)) {
			return message.channel.send(
				client.embedError(message, 'Cannot parse a non-integer.'),
			);
		}
		if (_caseNumber < 0) {
			return message.channel.send(
				client.embedError(message, 'Cannot parse an integer < 0.'),
			);
		}
		const caseNumber = parseInt(_caseNumber);
		let newReason = args.slice(1).join(' ');
		if (!newReason) newReason = 'Not specified';
		const warningResult = await warningModel.findOneAndUpdate({
			guildId: message.guild.id,
			caseNumber,
		}, {
			reason: newReason,
		});
		const reportResult = await reportSystemModel.findOneAndUpdate({
			guildId: message.guild.id,
			caseNumber,
		}, {
			reason: newReason,
		});
		const banResult = await banSystemModel.findOneAndUpdate({
			guildId: message.guild.id,
			caseNumber,
		}, {
			reason: newReason,
		});
		const kickResult = await kickSystemModel.findOneAndUpdate({
			guildId: message.guild.id,
			caseNumber,
		}, {
			reason: newReason,
		});
		if (!warningResult && !reportResult && !kickResult && !banResult) {
			message.channel.send(
				client.embedError(message, 'That case could not be found!'),
			);
		}
		else if (warningResult || reportResult || kickResult || banResult) {
			message.channel.send(
				client.embedSuccess(message, `Successfully edited the case number, \`${caseNumber}\` with the reason, ${newReason}!`),
			);
		}
	},
};