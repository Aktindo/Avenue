module.exports = {
	name: 'purge',
	aliases: ['clean', 'clear'],
	description: 'Clears messages from a channel with filters(if any)',
	category: 'Moderation',
	cooldown: 5,
	usage: '<type(all|bots|humans|matchedText|notMatchedText)> <amount?number>',
	requiredPermissions: ['MANAGE_MESSAGES'],
	botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS', 'MANAGE_MESSAGES'],
	async execute(client, message, args) {
		if (!args[0]) {
			return message.channel.send(
				client.embedError(message, 'Invalid arguments given!'),
			);
		}
		if (args[0].toLowerCase() == 'all') {
			const amount = args[1];
			if (!amount) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse a non-integer.'),
				);
			}

			if (isNaN(amount)) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse a non-integer.'),
				);
			}

			if (amount <= 0) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse an integer < or = to 0.'),
				);
			}
			if (amount >= 100) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse an integer > or = to 100.'),
				);
			}
			await message.channel.messages.fetch({ limit: parseInt(amount) + 1 }).then(messages => {
				message.channel.bulkDelete(messages, true);
				message.channel.send(
					client.embedSuccess(message, `Successfully purged ${parseInt(amount) + 1} messages from this channel with no filters.`),
				);
			});
		}
		else if (args[0].toLowerCase() == 'bots') {
			const amount = args[1];
			if (!amount) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse a non-integer.'),
				);
			}

			if (isNaN(amount)) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse a non-integer.'),
				);
			}

			if (amount <= 0) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse an integer < or = to 0.'),
				);
			}
			if (amount >= 100) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse an integer > or = to 100.'),
				);
			}
			await message.channel.messages.fetch({ limit: parseInt(amount) }).then(messages => {
				const botMessages = messages.filter(msg => (msg.author.bot));
				const botMessagesLength = botMessages.array().length;
				message.channel.bulkDelete(botMessages, true);
				message.channel.send(
					client.embedSuccess(message, `Successfully purged ${botMessagesLength} messages from this channel with filter - \`Delete only bot messages\``),
				);
			});
		}
		else if (args[0].toLowerCase() == 'humans') {
			const amount = args[1];
			if (!amount) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse a non-integer.'),
				);
			}

			if (isNaN(amount)) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse a non-integer.'),
				);
			}

			if (amount <= 0) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse an integer < or = to 0.'),
				);
			}
			if (amount >= 100) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse an integer > or = to 100.'),
				);
			}
			await message.channel.messages.fetch({ limit: parseInt(amount) }).then(messages => {
				const humanMessages = messages.filter(msg => !(msg.author.bot));
				const humanMessagesLength = humanMessages.array().length;
				message.channel.bulkDelete(humanMessages, true);
				message.channel.send(
					client.embedSuccess(message, `Successfully purged ${humanMessagesLength} messages from this channel with filter - \`Delete only human messages\``),
				);
			});
		}
		else if (args[0].toLowerCase() == 'matchedtext') {
			const text = args[1];
			if (!text) {
				return message.channel.send(
					client.embedError(message, 'Invalid argument given.'),
				);
			}
			const amount = args[2];
			if (!amount) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse a non-integer.'),
				);
			}

			if (isNaN(amount)) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse a non-integer.'),
				);
			}

			if (amount <= 0) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse an integer < or = to 0.'),
				);
			}

			if (amount >= 100) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse an integer > or = to 100.'),
				);
			}
			await message.channel.messages.fetch({ limit: parseInt(amount) }).then(messages => {
				const matchedTextMessages = messages.filter(msg => (msg.content.includes(text)));
				const matchedTextMessagesLength = matchedTextMessages.array().length;
				message.channel.bulkDelete(matchedTextMessages, true);
				message.channel.send(
					client.embedSuccess(message, `Successfully purged ${matchedTextMessagesLength} messages from this channel with filter - \`Delete only matched text messages\``),
				);
			});
		}
		else if (args[0].toLowerCase() == 'notmatchedtext') {
			const text = args[1];
			if (!text) {
				return message.channel.send(
					client.embedError(message, 'Invalid argument given.'),
				);
			}
			const amount = args[2];
			if (!amount) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse a non-integer.'),
				);
			}

			if (isNaN(amount)) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse a non-integer.'),
				);
			}

			if (amount <= 0) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse an integer < or = to 0.'),
				);
			}

			if (amount >= 100) {
				return message.channel.send(
					client.embedError(message, 'Cannot parse an integer > or = to 100.'),
				);
			}
			await message.channel.messages.fetch({ limit: parseInt(amount) }).then(messages => {
				const notMatchedTextMessages = messages.filter(msg => !msg.content.includes(text));
				const notMatchedTextMessagesLength = notMatchedTextMessages.array().length;
				message.channel.bulkDelete(notMatchedTextMessages, true);
				message.channel.send(
					client.embedSuccess(message, `Successfully purged ${notMatchedTextMessagesLength} messages from this channel with filter - \`Delete only not matched text messages\``),
				);
			});
		}
		else {
			message.channel.send(
				client.embedError(message, 'Invalid syntax given!'),
			);
		}
	},
};