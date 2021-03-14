const giveawayModel = require('../models/guild-giveaway-model');
module.exports = {
	name: 'giveaway-manager',
	enabled: true,
	execute(client) {
		const { GiveawaysManager } = require('discord-giveaways');
		class GiveawayManagerWithMongoose extends GiveawaysManager {
			// This function is called when the manager needs to get all the giveaways stored in the database.
			async getAllGiveaways() {
				// Get all the giveaways in the database. We fetch all documents by passing an empty condition.
				return await giveawayModel.find({});
			}

			// This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
			async saveGiveaway(messageID, giveawayData) {
				// Add the new one
				await giveawayModel.create(giveawayData);
				// Don't forget to return something!
				return true;
			}

			// This function is called when a giveaway needs to be edited in the database.
			async editGiveaway(messageID, giveawayData) {
				// Find by messageID and update it
				await giveawayModel
					.findOneAndUpdate({ messageID: messageID }, giveawayData)
					.exec();
				// Don't forget to return something!
				return true;
			}

			// This function is called when a giveaway needs to be deleted from the database.
			async deleteGiveaway(messageID) {
				// Find by messageID and delete it
				await giveawayModel
					.findOneAndDelete({ messageID: messageID })
					.exec();
				// Don't forget to return something!
				return true;
			}
		}

		// Create a new instance of your new class
		const manager = new GiveawayManagerWithMongoose(client, {
			updateCountdownEvery: 10000,
			default: {
				botsCanWin: false,
				exemptPermissions: [],
				embedColor: 'BLURPLE',
				reaction: '🎉',
			},
		});
		// We now have a giveawaysManager property to access the manager everywhere!
		client.giveawaysManager = manager;
	},
};