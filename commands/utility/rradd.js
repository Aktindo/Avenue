const { MessageEmbed } = require('discord.js')
const reactionSchema = require('../../models/reaction-role-model')
const { fetchCache, addToCache } = require('../../features/rr')

module.exports = {
    name: "rradd",
    description: "Adds the reaction role.",
    category: "Utility",
    cooldowns: 5,
    requiredPermissions: ['MANAGE_ROLES'],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "MANAGE_ROLES", "MANAGE_MESSAGES"],
    usage: "[Channel] <Message>",
    async execute(client, message, args) {
        const { guild } = message
    
        let emoji = args.shift() // 🎮
        if (!emoji) {
          return message.channel.send(
            client.embedError(message, 'Please provide a valid emoji.')
          )
        }

        let role = args.shift() // Warzone
        if (!role) {
          return message.channel.send(
            client.embedError(message, 'Please provide a role.')
          )
        }

        const displayName = args.join(' ') // 'Warzone game nights'
        if (!displayName) {
          return message.channel.send(
            client.embedError(message, 'Please provide a valid display name.')
          )
        }
    
        if (role.startsWith('<@&')) {
          role = role.substring(3, role.length - 1)
        }
    
        const newRole =
          guild.roles.cache.find((r) => {
            return r.name === role || r.id === role
          }) || null
    
        if (!newRole) {
          message.channel.send(
            client.embedError(message, "Please provide a valid role.")
          )
          return
        }
    
        role = newRole
    
        if (emoji.includes(':')) {
          const emojiName = emoji.split(':')[1]
          emoji = guild.emojis.cache.find((e) => {
            return e.name === emojiName
          })
        }
    
        const [fetchedMessage] = fetchCache(guild.id)
        if (!fetchedMessage) {
          message.channel.send(
            client.embedError(message, "An error occured please try again.")
          )
          return
        }
    
        const newLine = `${emoji} ${displayName}`
        let { content } = fetchedMessage
    
        if (content.includes(emoji)) {
          const split = content.split('\n')
    
          for (let a = 0; a < split.length; ++a) {
            if (split[a].includes(emoji)) {
              split[a] = newLine
            }
          }
    
          content = split.join('\n')
        } else {
          content += `\n${newLine}`
          fetchedMessage.react(emoji)
        }
    
        fetchedMessage.edit(content)
    
        const obj = {
          guildId: guild.id,
          channelId: fetchedMessage.channel.id,
          messageId: fetchedMessage.id,
        }
    
        await reactionSchema.findOneAndUpdate(
          obj,
          {
            ...obj,
            $addToSet: {
              roles: {
                emoji,
                roleId: role.id,
              },
            },
          },
          {
            upsert: true,
          }
        )
    
        addToCache(guild.id, fetchedMessage, emoji, role.id)

        message.channel.send(
          client.embedSuccess(message, 'Successfully updated the reaction role menu.')
        )
    }
}