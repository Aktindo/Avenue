const DiscordJS = require('discord.js')
const guildMessages = require('../../models/user-messagecount-model')
module.exports = {
    name: "eval",
    aliases: ["run", "r"],
    description: "Evaluates a javascript code given!",
    category: "System",
    cooldowns: 5,
    usage: "<code>",
    botOwnerOnly: true,
    guildOnly: true,
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {
        try {
            const code = args.join(" ");
            if (!code) return message.channel.send(
                client.embedError(message, "Please provide some code!")
            )
            let evaled = eval(code);
      
            if (typeof evaled !== "string") {
                evaled = require("util").inspect(evaled);
            }

            const embed = new DiscordJS.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('Eval Response')
            .setDescription(`\`\`\`xl\n${clean(evaled)}\`\`\``)
            .setColor('GREEN')

            message.channel.send(embed)

        } catch (err) {
            const embed = new DiscordJS.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('Error while executing code')
            .setDescription(`\`\`\`xl\n${clean(err)}\`\`\``)
            .setColor('RED')
            message.channel.send(embed)
        }
    }
}

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}