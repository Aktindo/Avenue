const fs = require("fs");
const { client } = require("../index");

client.logger.trace("Loading commands...", "command_handler");

const commandFolders = fs.readdirSync("./commands/");
let commandFiles;
let commandFilesLength = 0;
for (const folder of commandFolders) {
  commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  commandFilesLength += commandFiles.length;
  for (const file of commandFiles) {
    const command = require(`../commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

client.logger.trace(
  `Loaded a total of ${commandFilesLength} commands!`,
  "command_handler"
);
