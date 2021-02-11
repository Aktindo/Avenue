const { Client } = require('discord.js')
require('dotenv').config()

/** 
* @param {Client} client 
*/

module.exports = (client) => {
    const AutoPoster = require('topgg-autoposter')

    const ap = AutoPoster(process.env.TOPGG_TOKEN, client) // your discord.js or eris client
    
    // optional
    ap.on('posted', () => { // ran when succesfully posted
      console.log('Posted stats to top.gg')
    })
}