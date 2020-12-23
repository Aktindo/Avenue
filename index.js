require('dotenv').config()
const DiscordJS = require('discord.js')
const fs = require('fs')

const client = new DiscordJS.Client({
    partials: ['GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
})

fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
	  if (!file.endsWith(".js")) return;
	  const event = require(`./events/${file}`);
	  let eventName = file.split(".")[0];
	  console.log(`Attempting to register event - ${eventName}`)
	  client.on(eventName, event.bind(null, client));
	  delete require.cache[require.resolve(`./events/${file}`)];
	});
  });

  fs.readdir("./features/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
	  if (!file.endsWith(".js")) return;
	  const feature = require(`./features/${file}`);
	  let featureName = file.split(".")[0];
	  console.log(`Attempting to register feature - ${featureName}`)
	  feature(client)
	  delete require.cache[require.resolve(`./features/${file}`)];
	});
  });

client.commands = new DiscordJS.Collection();

const commandFolders = fs.readdirSync('./commands/')
let commandFoldersArr = []

commandFolders.forEach(i => {
	commandFoldersArr.push(i)
})

commandFoldersArr.forEach(c => {
	const commandFiles = fs.readdirSync(`./commands/${c}/`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${c}/${file}`);
		console.log(`Attempting to register command - ${command.name}`)
		client.commands.set(command.name, command);
	}
	
})

client.login(process.env.token)