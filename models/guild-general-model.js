const mongoose = require('mongoose')

const guildGeneralModel = mongoose.Schema({
    guildId: String,
    prefix: {
        type: String,
        default: "."
    },
    commandChannel: String,
})

module.exports = mongoose.model('guild-general-data', guildGeneralModel)