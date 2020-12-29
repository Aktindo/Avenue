const mongoose = require('mongoose')

const guildWelcomeModel = mongoose.Schema({
    guildId: String,
    text: String,
})

module.exports = mongoose.model('guild-welcome-data', guildWelcomeModel)