const mongoose = require('mongoose');

const verificationModel = mongoose.Schema({
	guildId: String,
	verificationChannelId: String,
	messageChannelId: String,
	message: String,
	roleId: String,
});

module.exports = mongoose.model('guild-verification-system-data', verificationModel);