const mongo = require('../util/mongo')
const chalk = require('chalk')
const moment = require('moment')
const fs = require('fs')
require('dotenv').config()

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
    console.log(`${chalk.magentaBright(`[${moment(Date.now()).format()}]`)} Logged in as ${client.user.username}!`)
    
    client.user.setPresence({
        status: process.env.ACTIVITY_STATUS ? process.env.ACTIVITY_STATUS : 'online',
        activity: {
            name: process.env.ACTIVITY_NAME ? process.env.ACTIVITY_NAME : 'with commands!',
            type: process.env.ACTIVITY_TYPE ? process.env.ACTIVITY_TYPE : 'PLAYING'
        }
    });
    await mongo().then(console.log(`${chalk.magentaBright(`[${moment(Date.now()).format()}]`)} Connected to database!`)).catch(e => console.error(`${chalk.red(`[${moment(Date.now()).format()}]`)} Error while connecting to database - ${e}`))
}