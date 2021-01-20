const logs = require('../models/logs')
module.exports = async (client, member) => {
    await logs.add(member.guild.id, 'leaves');
}