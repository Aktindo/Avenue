const mongoose = require('mongoose')

const guildRoleModel = mongoose.Schema({
    guildId: String,
    helperRole: String,
    moderatorRole: String,
    adminRole: String,
})

module.exports = mongoose.model('guild-roles-data', guildRoleModel)