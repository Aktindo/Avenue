require('dotenv').config();
const DiscordJS = require('discord.js');
const config = require('./config/config.json');
const Log = require('./util/Log');

const client = new DiscordJS.Client(
	{
		disableMentions: 'everyone',
	},
);

client.config = config;

Log.info('Loading resources...', 'client');

const commands = new DiscordJS.Collection();
const cooldown = new DiscordJS.Collection();

client.commands = commands;
client.cooldown = cooldown;

client.login(process.env.TOKEN)
	.catch((error) => {
		Log.error('Could not login into the client.', 'client', error);
	});

module.exports.client = client;
module.exports.commands = commands;

require('./handlers/CommandHandler');
require('./handlers/EventHandler');
require('./handlers/FeatureHandler');
require('./dashboard/server');