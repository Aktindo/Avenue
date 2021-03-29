const mongo = require("../util/Mongo");
require("dotenv").config();

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.logger.info(
      `Successfully logged in as ${client.user.username}!`,
      "client"
    );

    client.user.setPresence({
      status: client.env.ACTIVITY_STATUS
        ? client.env.ACTIVITY_STATUS
        : "online",
      activity: {
        name: client.env.ACTIVITY_NAME
          ? client.env.ACTIVITY_NAME
          : "with commands!",
        type: client.env.ACTIVITY_TYPE ? client.env.ACTIVITY_TYPE : "PLAYING",
      },
    });

    await mongo()
      .then(client.logger.info("Connected to database!", "database"))
      .catch((error) => {
        client.logger.error(
          "Could not connect to database.",
          "database",
          error
        );
      });
  },
};
