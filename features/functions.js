const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'functions',
	enabled: true,
	execute(client) {
		// List of all main and client functions

		// Client

		/**
         *
         * @param {Object} messageObject The message object
         * @param {String} message Success message
         *
         */
		client.embedSuccess = (messageObject, message) => {
			const embed = new MessageEmbed()
				.setAuthor(messageObject.author.username, messageObject.author.displayAvatarURL({ dynamic: true }))
				.setDescription(`<:greenTick:792047523803299850> ${message}`)
				.setColor('GREEN')
				.setFooter(client.user.tag, client.user.displayAvatarURL());
			return embed;
		};

		/**
         *
         * @param {Object} messageObject The message object
         * @param {String} message Error message
         *
         */
		client.embedError = (messageObject, message) => {
			const embed = new MessageEmbed()
				.setAuthor(messageObject.author.username, messageObject.author.displayAvatarURL({ dynamic: true }))
				.setDescription(`<:redTick:792047662202617876> ${message}`)
				.setColor('RED')
				.setFooter(client.user.tag, client.user.displayAvatarURL());
			return embed;
		};
	},
};

