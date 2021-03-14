const mongoose = require('mongoose');

const guildChannelModel = mongoose.Schema({
	guildId: String,
	reportChannel: String,
	botCommandChannel: String,
	welcomeChannel: String,
	acceptChannel: String,
	starboardChannel: String,
	modlogsChannel: String,
});

module.exports = mongoose.model('guild-channels-data', guildChannelModel);