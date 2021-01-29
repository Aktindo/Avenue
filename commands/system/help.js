const { MessageEmbed } = require("discord.js")
const guildGeneralModel = require("../../models/guild-general-model")
module.exports = {
    name: "help",
    description: "A command which displays all the commands of the bot.",
    category: "System",
    aliases: ["h", "info"],
    cooldowns: 5,
    usage: "[command_name]",
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        const data = await guildGeneralModel.findOne({
            _id: message.guild.id
        })
        let prefix 
        if (!data || !data.prefix) {
            prefix = 'a!'
        } else prefix = data.prefix
        let commandName = args.join("-")
        if (!commandName) {
            let infoCommands = client.commands.filter(cmd => cmd.category == "Information").map(c => `\`${c.name}\``).join(", ")
            let moderationCommands = client.commands.filter(cmd => cmd.category == "Moderation").map(c => `\`${c.name}\``).join(", ")
            let settingCommands = client.commands.filter(cmd => cmd.category == "Settings").map(c => `\`${c.name}\``).join(", ")
            let systemCommands = client.commands.filter(cmd => cmd.category == "System").map(c => `\`${c.name}\``).join(", ")
            let miscCommands = client.commands.filter(cmd => cmd.category == "Miscellaneous").map(c => `\`${c.name}\``).join(", ")
            let utilCommands = client.commands.filter(cmd => cmd.category == "Utility").map(c => `\`${c.name}\``).join(", ")

            const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setThumbnail(client.user.displayAvatarURL({format:"png", size: 4096}))
            .setTitle('Help Menu')
            .addField('Here are the commands!', `If you want to view more information on a command, use \`${prefix}help [command_name]\``, false)
            .addField('Information', infoCommands, false)
            .addField('Moderation', moderationCommands, false)
            .addField('Miscellaneous', miscCommands, false)
            .addField('Utility', utilCommands, false)
            .addField('Settings', settingCommands, false)
            .addField('System', systemCommands, false)
            .setColor('BLURPLE')
            .setTimestamp()

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
                helpEmbed.addField('Additional Note', 'Arguments that are wrapped with `<>` like `<query>` are required.\nArguments that are wrapped with `[]` like `[query]` are optional.\nA `|` after the argument means you can use either of the two arguments.\nArguments that end with a `?` have to be followed by the rule after it. Example - `<time?rule>`\nAny Argument enclosed in `()` need to be applied for the `?` rule. Example - `<time?endsWith(s|m|h)`\nAny argument enclosed in `{}` after an argument means you can include that variable in the argument to create dynamic stuff. Example - <welcomeMessage{user|server}>')
                message.channel.send(helpEmbed)
            }
        }
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}