const mongoose = require('mongoose')

const warningModel = mongoose.Schema({
    guildId: String,
    userId: String,
    caseNumber: Number,
    warnCaseNumber: Number,
    moderatorId: String,
    reason: String,
    timestamp: Number,
})

module.exports = mongoose.model('guild-warning-system-data', warningModel)