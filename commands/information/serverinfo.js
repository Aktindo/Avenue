const { MessageEmbed } = require('discord.js');
const moment = require('moment');
module.exports = {
	name: 'serverinfo',
	description: 'Displays some information on the server!',
	aliases: ['si'],
	category: 'Information',
	cooldown: 5,
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
	async execute(client, message) {
		const guildMemberPresence = async () => {
			let str;
			await message.guild.members.fetch().then(fetchedMembers => {
				const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online').size;
				const totalDnd = fetchedMembers.filter(member => member.presence.status === 'dnd').size;
				const totalIdle = fetchedMembers.filter(member => member.presence.status === 'idle').size;
				const totalOffline = fetchedMembers.filter(member => member.presence.status === 'offline').size;
				str = `<:online:794157545244852244>: ${totalOnline} <:dnd:794157544552923136>: ${totalDnd} <:idle:794157544397340702>: ${totalIdle} (Total: ${fetchedMembers.filter(member => member.presence.status !== 'offline').size})\n<:invisible:794157545383002152>: ${totalOffline}                `;
			});
			return str;
		};

		const explicitContentObj = {
			DISABLED: '<:redTick:792047662202617876> Disabled',
			MEMBERS_WITHOUT_ROLES: '<:greenTick:792047523803299850> Members without roles',
			ALL_MEMBERS: '<:greenTick:792047523803299850> All members',
		};
		const verificationLevelObj = {
			NONE: 'None',
			LOW: 'Low',
			MEDIUM: 'Medium',
			HIGH: 'High',
			VERY_HIGH: 'Very High',
		};
		const boostTier = {
			0: 'No Level',
			1: 'Level 1',
			2: 'Level 2',
			3: 'Level 3',
		};
		let factorModeration;
		if (message.guild.mfaLevel == 0) factorModeration = '<:redTick:792047662202617876> Disabled';
		else factorModeration = '<:greenTick:792047523803299850> Enabled';
		const embed = new MessageEmbed()
			.setColor('BLURPLE')
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setTitle(`Information on ${message.guild.name}`)
			.addField('Guild Owner', `<:owner:794192802178793483> ${message.guild.owner} (${message.guild.ownerID})`, false)
			.addField('Guild Creation Date', `${moment(message.guild.createdAt).format('h:mm:ss a, MMMM Do YYYY')}\n(${moment(message.guild.createdAt, 'YYYYMMDD').fromNow()})`, false)
			.addField('Members', `Users: ${message.guild.members.cache.filter(u => !u.user.bot).size}, Bots: ${message.guild.members.cache.filter(u => u.user.bot).size}, Total: ${message.guild.members.cache.size}`, true)
			.addField('Channels', `Text: ${message.guild.channels.cache.filter(c => c.type == 'text').size}, Voice: ${message.guild.channels.cache.filter(c => c.type == 'voice').size}, News: ${message.guild.channels.cache.filter(c => c.type == 'news').size}, Category: ${message.guild.channels.cache.filter(c => c.type == 'category').size}`, true)
			.addField('\u200b', await guildMemberPresence(), false)
			.addField('Server Boost', `<:boosts:794441859321167872> ${message.guild.premiumSubscriptionCount} (${boostTier[message.guild.premiumTier]})`)
			.addField('Roles', message.guild.roles.cache.size, true)
			.addField('Channels', message.guild.channels.cache.size, true)
			.addField('Explicit Content Filter', explicitContentObj[message.guild.explicitContentFilter], false)
			.addField('2FA Moderation', factorModeration, false)
			.addField('Verification Level', verificationLevelObj[message.guild.verificationLevel], false);
		message.channel.send(embed);
	},
};