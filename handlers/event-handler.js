const Log = require("../util/Log");
const fs = require("fs");
const { client } = require("../index");

client.logger.trace("Loading events...", "event_handler");

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`../events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.logger.trace(
  `Loaded a total of ${eventFiles.length} events!`,
  "event_handler"
);
