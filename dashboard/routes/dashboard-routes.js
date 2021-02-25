const guildGeneralModel = require('../../models/guild-general-model')
const guildWelcomeModel = require('../../models/guild-welcome-model')
const guildChannelsModel = require('../../models/guild-channels-model')
const log = require('../modules/audit-logger');
const logs = require('../../models/logs');
const {client} = require('../../index')
const { validateGuild } = require('../modules/middleware');
const fetch = require('node-fetch')
const express = require('express');


const router = express.Router();

router.get('/dashboard', (req, res) => res.render('dashboard/index'));

router.get('/servers/:id', validateGuild, async (req, res) => res.render('dashboard/show', {
    subtitle: `Editing ${client.guilds.cache.get(req.params.id).name}`,
    guildData: await guildGeneralModel.findOne({_id: req.params.id}),
    savedLog: await logs.get(req.params.id),
    users: client.users.cache
}));

router.put('/servers/:id/:module', validateGuild, async (req, res) => {
    try {
        const {id, module} = req.params

        if (module.toString() == "general") {
            const data = await guildGeneralModel.findOneAndUpdate({
                _id: id,
            }, {
                _id: id,
                prefix: req.body.prefixInput.toString(),
                commandChannel: req.body.commandChannelInput.toString(),
            }, {
                upsert: true
            })

            await log.change(id, {
                at: new Date(),
                by: res.locals.user.id,
                module,
                new: data,
                old: req.body
              });
    
            res.redirect('/servers/' + id)
            if (req.body.nickInput) {
                await client.guilds.cache.get(req.params.id).me.setNickname(req.body.nickInput)
            }
        }
        if (module.toString() == "welcome") {
            const welcomeData = await guildWelcomeModel.findOneAndUpdate({
                guildId: id,
            }, {
                guildId: id,
                text: req.body.welcomeMessage
            }, {
                upsert: true
            })
            const channelData = await guildChannelsModel.findOneAndUpdate({
                guildId: id,
            }, {
                guildId: id,
                welcomeChannel: req.body.welcomeChannel
            }, {
                upsert: true
            })
            await log.change(id, {
                at: new Date(),
                by: res.locals.user.id,
                module,
                new: [welcomeData, channelData],
                old: req.body
              });
            res.redirect('/servers/' + id)
        }
    } catch(e) {
        console.log(e)
        res.render('errors/400')
    }
})

module.exports = router;