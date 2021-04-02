require("dotenv").config();

/**
 * @param {Client} client
 */

module.exports = {
  name: "dbl",
  enabled: false,
  execute(client) {
    const AutoPoster = require("topgg-autoposter");

    const ap = AutoPoster(client.env.TOPGG_TOKEN, client);

    ap.on("posted", () => {
      client.logger.info("Posted stats to top.gg", "dbl_autoposter");
    });
  },
};
