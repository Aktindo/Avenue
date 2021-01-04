const mongo = require('../util/mongo')
const chalk = require('chalk')
const moment = require('moment')
const fs = require('fs')
const config = require('../config/config.json')
const { MessageEmbed } = require('discord.js')
module.exports = async client => {
    client.config = config
    console.log(`${chalk.green(`[${moment(Date.now()).format()}]`)} Logged in as - ${client.user.username}!`)
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
    fs.readdir("./features/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          if (!file.endsWith(".js")) return;
          const feature = require(`../features/${file}`);
          let featureName = file.split(".")[0];
          console.log(`${chalk.green(`[${moment(Date.now()).format()}]`)} Enabling feature - ${featureName}`)
          feature(client)
          delete require.cache[require.resolve(`../features/${file}`)];
        });
      });
    await mongo().then(console.log(`${chalk.green(`[${moment(Date.now()).format()}]`)} Connected to database!`)).catch(e => console.error(`${chalk.red(`[${moment(Date.now()).format()}]`)} Error while connecting to database - ${e}`))
    const restartChannel = client.channels.cache.get("794088607575965708")
    await restartChannel.send(
        new MessageEmbed()
        .setTitle('Restart Notification')
        .setDescription(`There was a restart on **${moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')}**.\nIt can be due to an error or ${client.users.cache.get("683879319558291539")} restarted me.`)
        .setColor('BLURPLE')
        .setTimestamp()
    )
}