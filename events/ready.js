const mongo = require('../util/mongo')
module.exports = async client => {
    console.log('Logged in as ' + client.user.tag + '!')
    client.user.setPresence({
        status: "online",
        activity: {
            name: "with commands! | @Avenue help",
            type: "PLAYING"
        }
    });
    await mongo().then(console.log('Connected to database!')).catch(e => console.error('Error while connecting to the database: ' + e))
}