const giveawayModel = require("../models/guild-giveaway-model");
module.exports = {
  name: "giveaway-manager",
  enabled: true,
  execute(client) {
    const { GiveawaysManager } = require("discord-giveaways");
    class GiveawayManagerWithMongoose extends GiveawaysManager {
      async getAllGiveaways() {
        return await giveawayModel.find({});
      }

      async saveGiveaway(messageID, giveawayData) {
        await giveawayModel.create(giveawayData);

        return true;
      }

      async editGiveaway(messageID, giveawayData) {
        await giveawayModel
          .findOneAndUpdate({ messageID: messageID }, giveawayData)
          .exec();

        return true;
      }

      async deleteGiveaway(messageID) {
        await giveawayModel.findOneAndDelete({ messageID: messageID }).exec();

        return true;
      }
    }

    const manager = new GiveawayManagerWithMongoose(client, {
      updateCountdownEvery: 10000,
      default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: client.env.EMBED_NEUTRAL_COLOR,
        reaction: "🎉",
      },
    });

    client.giveawaysManager = manager;
  },
};
