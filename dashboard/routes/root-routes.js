const express = require('express')
const {commands} = require('../../index')

const router = express.Router()

router.get('/', (req, res) => res.render('index'));

router.get('/commands', (req, res) => res.render('commands', {
  subtitle: 'Commands',
  categories: [
    { name: 'Information', icon: 'fas fa-book' },
    { name: 'Moderation', icon: 'fas fa-gavel' }, 
    { name: 'Settings', icon: 'fas fa-cogs'},
    { name: 'Utility', icon: 'fas fa-bars'},
    { name: 'System', icon: 'fas fa-laptop' }
  ],
  commands: Array.from(commands.values()),
  commandsString: JSON.stringify(Array.from(commands.values()))
}));

router.get('/faq', (req, res) => res.render('faq', {
    subtitle: "FAQ"
}))

router.get('/blogs', (req, res) => res.render('blogs', {
  subtitle: "Blogs"
}))

router.get('/support', (req, res) => {
  res.redirect('https://discord.gg/6g297Usrsn')
})


module.exports = router