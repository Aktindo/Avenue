const Log = require("../util/Log");
require("dotenv").config();

/**
 * @param {Client} client
 */

module.exports = {
  name: "dbl",
  enabled: false,
  execute(client) {
    const AutoPoster = require("topgg-autoposter");

    const ap = AutoPoster(process.env.TOPGG_TOKEN, client);

    ap.on("posted", () => {
      Log.info("Posted stats to top.gg", "dbl_autoposter");
    });
  },
};
