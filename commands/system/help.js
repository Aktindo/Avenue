const { MessageEmbed } = require("discord.js")
require('dotenv').config()
module.exports = {
    name: "help",
    description: "A command which displays all the commands of the bot.",
    category: "system",
    aliases: ["h", "info"],
    cooldowns: 5,
    usage: "[command_name]",
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    execute(client, message, args) {
        let commandName = args.join("-")
        if (!commandName) {
            let infoCommands = client.commands.filter(cmd => cmd.category == "information").map(c => `\`${c.name}\``).join(", ")
            let moderationCommands = client.commands.filter(cmd => cmd.category == "moderation").map(c => `\`${c.name}\``).join(", ")
            let settingCommands = client.commands.filter(cmd => cmd.category == "settings").map(c => `\`${c.name}\``).join(", ")
            let systemCommands = client.commands.filter(cmd => cmd.category == "system").map(c => `\`${c.name}\``).join(", ")
            let utilCommands = client.commands.filter(cmd => cmd.category == "util").map(c => `\`${c.name}\``).join(", ")

            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('Help Menu')
            .setDescription(`These are all the commands I currently have. Use \`${process.env.prefix}help [command_name]\` to view more information on a specific command.`)
            .addField('Information', infoCommands, false)
            .addField('Moderation', moderationCommands, false)
            .addField('Settings', settingCommands, false)
            .addField('Utility', utilCommands, false)
            .addField('System', systemCommands, false)
            .setColor('BLURPLE')

            message.channel.send(embed)
        }
        else {
            const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));
            let data = []
            if (!command) {
                return message.channel.send(
                    new MessageEmbed()
                    .setAuthor(message.author.username)
                    .setDescription('<:redTick:792047662202617876> I could not find that command!')
                    .setColor('RED')
                )
            }
            else {
                if (command.description) data.push(`**Description:** ${command.description}`)
                if (command.cooldowns) data.push(`**Cooldown:**\n User - ${command.cooldowns}s`)
                if (command.aliases) data.push(`**Aliases:** \`${command.aliases.join(', ')}\``)
                if (command.usage) data.push(`**Usage:**\n\`${process.env.prefix}${command.name} ${command.usage}\``)
                if (command.variables) data.push(`**Variables:**\n\`${command.variables.join(', ')}\``)
                const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle(`Command Name: ${command.name}`)
                .setDescription(data)
                .addField('Keys', '`<>` - Required\n`[]` - Optional\n`|` - Or')
                .setColor('BLURPLE')
                message.channel.send(embed)
            }
        }
    }
}