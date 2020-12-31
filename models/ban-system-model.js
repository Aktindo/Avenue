const mongoose = require('mongoose')

const banSystemModel = mongoose.Schema({
    guildId: String,
    userId: String,
    caseNumber: Number,
    banCaseNumber: Number,
    moderatorId: String,
    reason: String,
    timestamp: Number,
})

module.exports = mongoose.model("guild-ban-system-data", banSystemModel)