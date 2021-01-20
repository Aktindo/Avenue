require('dotenv').config()
const OAuthClient = require('disco-oauth');

const client = new OAuthClient(process.env.CLIENT_ID, process.env.SECRET);
client.setRedirect(`${process.env.DASHBOARD_URL}/auth`);
client.setScopes('identify', 'guilds');

module.exports = client; 