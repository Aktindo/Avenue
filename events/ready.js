const mongo = require('../util/Mongo');
const Log = require('../util/Log');
require('dotenv').config();

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		Log.info(`Successfully logged in as ${client.user.username}!`, 'client');

		client.user.setPresence({
			status: process.env.ACTIVITY_STATUS ? process.env.ACTIVITY_STATUS : 'online',
			activity: {
				name: process.env.ACTIVITY_NAME ? process.env.ACTIVITY_NAME : 'with commands!',
				type: process.env.ACTIVITY_TYPE ? process.env.ACTIVITY_TYPE : 'PLAYING',
			},
		});

		await mongo()
			.then(
				Log.info('Connected to database!', 'database'),
			)
			.catch((error) => {
				Log.error('Could not connect to database.', 'database', error);
			});
	},
};