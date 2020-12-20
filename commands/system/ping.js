module.exports = {
    name: "ping",
    description: "A command to test the latency of the bot.",
    aliases: ["p"],
    execute(client, message, args) {
        message.channel.send("Pong!")
    }
}