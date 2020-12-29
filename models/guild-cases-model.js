const mongoose = require('mongoose')

const guildCasesModel = mongoose.Schema({
    guildId: String,
    totalCases: Number,
    warnCases: Number,
    reportCases: Number,
    banCases: Number,
})

module.exports = mongoose.model('guild-cases-data', guildCasesModel)