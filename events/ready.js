const mongo = require('../util/mongo')
const chalk = require('chalk')
const moment = require('moment')
const fs = require('fs')
const config = require('../config/config.json')
const { MessageEmbed } = require('discord.js')
module.exports = async client => {
    fs.readdir("./features/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          if (!file.endsWith(".js")) return;
          const feature = require(`../features/${file}`);
          const featureName = file.split('.')[0]
          console.log(`${chalk.cyan(`[${moment(Date.now()).format()}]`)} Registering feature - ${featureName}`)
          feature(client)
          delete require.cache[require.resolve(`../features/${file}`)];
        });
    });
    client.config = config
    console.log(`${chalk.magentaBright(`[${moment(Date.now()).format()}]`)} Logged in as ${client.user.username}!`)
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
    await mongo().then(console.log(`${chalk.magentaBright(`[${moment(Date.now()).format()}]`)} Connected to database!`)).catch(e => console.error(`${chalk.red(`[${moment(Date.now()).format()}]`)} Error while connecting to database - ${e}`))
}