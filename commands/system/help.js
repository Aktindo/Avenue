const { MessageEmbed } = require("discord.js")
require('dotenv').config()
module.exports = {
    name: "help",
    description: "A command which displays all the commands of the bot.",
    category: "System",
    aliases: ["h", "info"],
    cooldowns: 5,
    usage: "[command_name]",
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    execute(client, message, args) {
        let commandName = args.join("-")
        if (!commandName) {
            let infoCommands = client.commands.filter(cmd => cmd.category == "Information").map(c => `\`${c.name}\``).join(", ")
            let moderationCommands = client.commands.filter(cmd => cmd.category == "Moderation").map(c => `\`${c.name}\``).join(", ")
            let settingCommands = client.commands.filter(cmd => cmd.category == "Settings").map(c => `\`${c.name}\``).join(", ")
            let systemCommands = client.commands.filter(cmd => cmd.category == "System").map(c => `\`${c.name}\``).join(", ")
            let utilCommands = client.commands.filter(cmd => cmd.category == "Utility").map(c => `\`${c.name}\``).join(", ")

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
            if (!command) {
                return message.channel.send(
                    new MessageEmbed()
                    .setAuthor(message.author.username)
                    .setDescription('<:redTick:792047662202617876> I could not find that command!')
                    .setColor('RED')
                )
            }
            else {
                const helpEmbed = new MessageEmbed()
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setColor('BLURPLE')
                .addField('Command', capitalizeFirstLetter(command.name), false) 
                let commandUsage
                if (command.usage) commandUsage = ` ${command.usage}`
                else commandUsage = ""
                if (command.description) helpEmbed.addField('Description', command.description, false)
                if (command.aliases) helpEmbed.addField('Aliases', command.aliases.map(a => `\`${a}\``).join(', '), false)
                if (command.cooldowns) helpEmbed.addField('Cooldowns', `User - ${command.cooldowns}s`)
                helpEmbed.addField('Usage', `\`${process.env.prefix}${command.name}${commandUsage}\``)
                if (command.requiredPermissions) {
                    const permissions = command.requiredPermissions.map(p => capitalizeFirstLetter(p).split('_').join(' ')).join(', ')
                    helpEmbed.addField('Permissions Required', permissions, false)
                }
                if (command.botPermissions) {
                    const permissions = command.botPermissions.map(p => capitalizeFirstLetter(p).split('_').join(' ')).join(', ')
                    helpEmbed.addField('Permissions Required by Bot', permissions, false)
                }
                helpEmbed.addField('Additional Note', 'Arguments that are wrapped with `<>` like `<query>` are required.\nArguments that are wrapped with `[]` like `[query]` are optional.\nAny argument enclosed in `{}` after an argument means you can include that variable in the argument to create dynamic stuff.\nA `|` after the argument means you can use either of the two arguments.')
                message.channel.send(helpEmbed)
            }
        }
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}