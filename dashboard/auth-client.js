require('dotenv').config()
const OAuthClient = require('disco-oauth');
const config = require('../config.json');

const client = new OAuthClient(process.env.clientId, process.env.secret);
client.setRedirect(`${config.dashboardURL}/dashboard`);
client.setScopes('identify', 'guilds');

module.exports = client; 