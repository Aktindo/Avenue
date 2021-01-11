require('dotenv').config()
const express = require('express')
const authClient = require('../auth-client')
const router = express.Router()

router.get('/login', (req, res) => res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.clientId}&redirect_uri=${process.env.dashboardURL}/auth&response_type=code&scope=identify guilds&prompt=none`))

router.get('/auth', async (req, res) => {
    const code = req.query.code
    const key = await authClient.getAccess(code)
    res.send(key)
})

module.exports = router