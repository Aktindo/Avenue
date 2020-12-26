const mongoose = require('mongoose')

const guildCasesModel = mongoose.Schema({
    guildId: String,
    totalCases: Number,
    warnCases: Number,
})

module.exports = mongoose.model('guild-cases-data', guildCasesModel)