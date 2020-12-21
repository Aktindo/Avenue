const DiscordJS = require('discord.js')
const fs = require('fs')
module.exports = {
    name: "reload",
    aliases: ["rl"],
    description: "Reloads a command!",
    category: "system",
    args: true,
    usage: "<command>",
    botOwnerOnly: true,
    guildOnly: true,
    cooldown: 2,
    execute(client, message, args) {
        if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`)
        const commandName = args[0].toLowerCase();
        const command = client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

        let commandFilesArr = []
        const commandFiles = fs.readdirSync('./commands')
        commandFiles.forEach(i => commandFilesArr.push(i))
        commandFilesArr.forEach(c => {
            const commandToReload = fs.readdirSync(`./commands/${c}`)
            console.log(commandToReload)
            commandToReload.forEach(file => {
                if (file.split(".")[0] == command.name) {
                    delete require.cache[require.resolve(`../../commands/${c}/${file}`)];
                    try {
                        const newCommand = require(`../../commands/${c}/${command.name}.js`);
                        message.client.commands.set(newCommand.name, newCommand);
                        message.channel.send(`Command \`${command.name}\` was reloaded!`);
                    } catch (error) {
                        console.error(error);
                        message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
                    }
                }
            })
        })
    }
}