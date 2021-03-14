const mongoose = require('mongoose');

const guildGeneralModel = mongoose.Schema({
	_id: String,
	prefix: {
		type: String,
		default: '.',
	},
	commandChannel: String,
});

module.exports = mongoose.model('guild-general-data', guildGeneralModel);