const mongoose = require('mongoose')

const kickSystemModel = mongoose.Schema({
    guildId: String,
    userId: String,
    caseNumber: Number,
    kickCaseNumber: Number,
    moderatorId: String,
    reason: String,
    timestamp: Number,
})

module.exports = mongoose.model("guild-kick-system-data", kickSystemModel)