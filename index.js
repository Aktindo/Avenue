require("dotenv").config();
const DiscordJS = require("discord.js");
const config = require("./config/config.json");
const el4js = require("el4js");

const client = new DiscordJS.Client({
  disableMentions: "everyone",
});

const logger = new el4js.Logger();
client.logger = logger;

logger.trace("Loading resources...", "client");

client.config = config;

const commands = new DiscordJS.Collection();
const cooldown = new DiscordJS.Collection();

client.commands = commands;
client.cooldown = cooldown;
client.env = process.env;

client.login(client.env.TOKEN).catch((error) => {
  logger.error("Could not login into the client.", "client");
});

module.exports.client = client;
module.exports.commands = commands;

require("./handlers/command-handler");
require("./handlers/event-handler");
require("./handlers/feature-handler");

logger.trace("Loaded all resources!");
