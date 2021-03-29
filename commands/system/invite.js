module.exports = {
  name: "invite",
  description: "The invite link to invite the bot to your server",
  category: "System",
  cooldown: 5,
  aliases: ["inv"],
  botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  async execute(client, message) {
    return message.channel.send(
      client.embedSuccess(
        message,
        `If you want to use me in your server(s), click [here](https://discord.com/oauth2/authorize?client_id=${client.env.CLIENT_ID}&permissions=2146959351&redirect_uri=${client.env.DASHBOARD_URL}/auth&response_type=code&scope=bot%20identify%20guilds)`
      )
    );
  },
};
