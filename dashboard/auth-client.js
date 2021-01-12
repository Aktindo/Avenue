require('dotenv').config()
const OAuthClient = require('disco-oauth');

const client = new OAuthClient(process.env.clientId, process.env.secret);
client.setRedirect(`${process.env.dashboardURL}/auth`);
client.setScopes('identify', 'guilds');

module.exports = client; 