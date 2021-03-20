const Log = require("../util/Log");
const fs = require("fs");
const { client } = require("../index");

Log.info("Loading features...", "feature_handler");

const featureFiles = fs
  .readdirSync("./features")
  .filter((file) => file.endsWith(".js"));

for (const file of featureFiles) {
  const feature = require(`../features/${file}`);
  if (!feature.enabled) {
    Log.warning(
      `The feature (${feature.name}) is not enabled.`,
      "feature_handler"
    );
    continue;
  }
  feature.execute(client);
}

Log.info(
  `Loaded a total of ${featureFiles.length} features!`,
  "feature_handler"
);
