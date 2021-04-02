const fs = require("fs");
module.exports = {
  name: "reload",
  description: "Reloads a command if given.",
  aliases: ["rl"],
  usage: "<command>",
  category: "System",
  requiredPermissions: ["SEND_MESSAGES"],
  botPermissions: [
    "SEND_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "USE_EXTERNAL_EMOJIS",
  ],
  cooldown: 5,
  botOwnerOnly: true,
  /**
   * @param {Message} message
   * @param {String[]} args
   */
  execute(client, message, args) {
    if (!args.length) {
      return message.channel.send(
        client.embedError(message, "Please provide a command to reload.")
      );
    }

    const commandName = args[0].toLowerCase();
    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) {
      return message.channel.send(
        client.embedError(message, "Please provide a **valid** command.")
      );
    }

    const commandFolders = fs.readdirSync("./commands");
    const folderName = commandFolders.find((folder) =>
      fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`)
    );

    delete require.cache[
      require.resolve(`../${folderName}/${command.name}.js`)
    ];

    try {
      const newCommand = require(`../${folderName}/${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);

      message.channel.send(
        client.embedSuccess(
          message,
          `Successfully reloaded the command ${command.name}. Took **${message.client.ws.ping}**ms`
        )
      );
    } catch (error) {
      client.logger.error(
        `Error while reloading command ${command.name}.\n${error.message}`,
        "command_handler_reload"
      );
      message.channel.send(
        client.embedError(
          `Error while reloading command ${command.name}.\n\`\`\`xml${error.message}\`\`\``
        )
      );
    }
  },
};
