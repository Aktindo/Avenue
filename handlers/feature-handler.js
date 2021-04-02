const fs = require("fs");
const { client } = require("../index");

client.logger.trace("Loading features...", "feature_handler");

const featureFiles = fs
  .readdirSync("./features")
  .filter((file) => file.endsWith(".js"));

for (const file of featureFiles) {
  const feature = require(`../features/${file}`);
  if (!feature.enabled) {
    client.logger.warning(
      `The feature (${feature.name}) is not enabled.`,
      "feature_handler"
    );
    continue;
  }
  feature.execute(client);
}

client.logger.trace(
  `Loaded a total of ${featureFiles.length} features!`,
  "feature_handler"
);
