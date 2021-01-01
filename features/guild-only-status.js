const seconds = 5
const startingCounter = 60
let counter = startingCounter
let importantData
const axios = require('axios').default
const Discord = require('discord.js')

const result = axios.get('https://kt6y7ldjbz7v.statuspage.io/api/v2/status.json')

const resultObj = {
    none: "<:greenTick:792047523803299850> All Systems Operational",
    minor: "❗ Minor Outage/Degraded Perfomance",
    major: "⚠ Major Outage",
    critical: "<:redTick:792047662202617876> Critical",
    maintenance: "🔍 Maintenance"
}

const fetchData = async () => {
  importantData = `**Bot Status**\n${resultObj[(await result).data.status.indicator]}`
}

const getText = () => {
  const res = (`${importantData}\n\nUpdating in ${counter} seconds...`)
  return res
}

const updateCounter = async (message) => {
  message.edit(getText())
  counter -= seconds

  if (counter <= 0) {
    counter = startingCounter
    await fetchData()
  }

  setTimeout(() => {
    updateCounter(message)
  }, 1000 * seconds)
}


module.exports = async (client) => {
  await fetchData()

  const channel = await client.channels.fetch('794068687631941693')

  await channel.messages.fetch().then(async msg => {
      if (msg.size == 0) {
          const message = await channel.send(getText())
          updateCounter(message)
      }
      else {
          await msg.first().delete()
          const message = await channel.send(getText())
          updateCounter(message)
      }
  })
}