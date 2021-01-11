const mongoose = require('mongoose')

const guildStarboardModel = mongoose.Schema({
    guildId: String,
    enabled: Boolean,
    showJumpLink: Boolean,
    minStars: Number,
})

module.exports = mongoose.model('guild-starboard-data', guildStarboardModel)