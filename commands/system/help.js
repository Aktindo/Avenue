const { MessageEmbed } = require("discord.js")
const { guildOnly } = require("./eval")
require('dotenv').config()
module.exports = {
    name: "help",
    description: "A command which displays all the commands of the bot.",
    category: "system",
    aliases: ["h", "info"],
    cooldowns: 5,
    usage: "[command_name]",
    execute(client, message, args) {
        let commandName = args.join("-")
        if (!commandName) {
            let funCommands = client.commands.filter(cmd => cmd.category == "fun").map(c => `\`${c.name}\``).join(", ")
            let systemCommands = client.commands.filter(cmd => cmd.category == "system").map(c => `\`${c.name}\``).join(", ")
            console.log(systemCommands)

            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('Help Menu')
            .setDescription(`These are all the commands I currently have. Use \`${process.env.prefix}help [command_name]\` to view more information on a specific command.`)
            .addField('System', systemCommands, false)
            .setColor('GREEN')

            message.channel.send(embed)
        }
        else {
            const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));
            let data = []
            if (!command) {
                return message.channel.send('I could not find that command.')
            }
            else {
                let guildOnlyValue
                if (command.description) data.push(`**Description:** ${command.description}`)
                if (command.cooldowns) data.push(`**Cooldown:**\n User - \`${command.cooldowns}s\``)
                if (command.aliases) data.push(`**Aliases:** \`${command.aliases.join(', ')}\``)
                if (command.usage) data.push(`**Usage:**\n\`${process.env.prefix}${command.name} ${command.usage}\``)
                switch (command.guildOnly) {
                    case true:
                        guildOnlyValue = "Yes"
                        break;
                    default:
                        guildOnlyValue = "No"
                }
                data.push(`**Guild Only:** ${guildOnlyValue}`)
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle(`Command Name: ${command.name}`)
                .setDescription(data)
                .addField('Keys', '`<>` - Required \n `[]` - Optional')
                .setColor('GREEN')
                message.channel.send(embed)
            }
        }
    }
}