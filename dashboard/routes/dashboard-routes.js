const guildGeneralModel = require('../../models/guild-general-model')
const {client} = require('../../index')
const { validateGuild } = require('../modules/middleware');
const fetch = require('node-fetch')
const express = require('express');


const router = express.Router();

router.get('/dashboard', (req, res) => res.render('dashboard/index'));

router.get('/servers/:id', validateGuild, async (req, res) => res.render('dashboard/show', {
    subtitle: 'Editing Server',
    guildData: await guildGeneralModel.findOne({
        guildId: req.params.id
    })
}));

router.put('/servers/:id/:module', validateGuild, async (req, res) => {
    try {
        const {id, module} = req.params

        if (module.toString() == "general") {
            await guildGeneralModel.findOneAndUpdate({
                guildId: id,
            }, {
                guildId: id,
                prefix: req.body.prefixInput.toString(),
                commandChannel: req.body.commandChannelInput.toString(),
            }, {
                upsert: true
            })
    
            res.redirect('/servers/' + id)
        }
        if (module.toString() == "reports") {
            const url = "https://discord.com/api/webhooks/800960292439326720/-KLL-4Uzp1HUbn5EnLX-ElCOvHgGmOKijEKKhwU9_bxaw-j4nis3u7u-LJGBhilYp1g6"
            const guild = client.guilds.cache.get(id)
            fetch(url, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    content: req.body.mainReportType,
                    embeds: [
                        {
                            author: {
                                name: `New ${req.body.mainReportType} from ${req.body.mainReportAuthor}(${guild.name})`
                            },
                            title: req.body.mainReportSubject,
                            description: `**${req.body.mainReportTitle}**\n\n${req.body.mainReportDescription}`,
                            color: '3447003'
                        }
                    ]
                })
            })
            res.redirect('/servers/' + id)
        }
    } catch(e) {
        console.log(e)
        res.render('errors/400')
    }
})

module.exports = router;