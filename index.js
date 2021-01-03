require('dotenv').config()
const DiscordJS = require('discord.js')
const fs = require('fs')
const chalk = require('chalk')
const moment = require('moment')

const client = new DiscordJS.Client({
    partials: ['GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
})

fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
	  if (!file.endsWith(".js")) return;
	  const event = require(`./events/${file}`);
	  let eventName = file.split(".")[0];
	  console.log(`${chalk.green(`[${moment(Date.now()).format()}]`)} Registering event - ${eventName}`)
	  client.on(eventName, event.bind(null, client));
	  delete require.cache[require.resolve(`./events/${file}`)];
	});
  });

const commands = new DiscordJS.Collection();

client.commands = commands

const commandFolders = fs.readdirSync('./commands/')
let commandFoldersArr = []

commandFolders.forEach(i => {
	commandFoldersArr.push(i)
})

commandFoldersArr.forEach(c => {
	const commandFiles = fs.readdirSync(`./commands/${c}/`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${c}/${file}`);
		const commandName = file.split(".")[0]
		console.log(`${chalk.green(`[${moment(Date.now()).format()}]`)} Registering Command - ${commandName}`)
		client.commands.set(command.name, command);
	}
	
})

require('./dashboard/server')

client.login(process.env.token)

module.exports.commands =  commands