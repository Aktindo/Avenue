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
    client.api.applications(client.user.id).guilds('772129415005470740').commands.post({
        data: {
            name: "hello",
            description: "Replies with Hello World!"
        }
    });

    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        if(command == 'hello') {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "Hello World! Coming soon :)"
                    }
                }
            });
        }
    });
    await mongo().then(console.log('Connected to database!')).catch(e => console.error('Error while connecting to the database: ' + e))
}