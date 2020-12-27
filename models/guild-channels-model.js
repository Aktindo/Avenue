const mongoose = require('mongoose')

const guildChannelModel = mongoose.Schema({
    guildId: String,
    reportChannel: String,
})

module.exports = mongoose.model('guild-channels-data', guildChannelModel)