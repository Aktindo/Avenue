# Avenue

Avenue is a discord bot that features a lot of features... especially moderation. It helps you to keep the pesky guys and spammers out of servers as well as manages your server with reaction roles, stats and more.

# Documentation

The documentation for this project is a work in progress at https://aktindo.thedev.id/docs

# Contributing

If you have any ideas or changes you want to make, you can always open a pull request.

# Setup

If you need to make a clone of this project, you can do it under 5 minutes.

- Install Git on your machine.
- Run `git clone https://github.com/Aktindo/Avenue.git` in the terminal of your desired folder.
- Make a new file with the name `.env` and
  paste the following contents.  
   **NOTE:** Do not literally type `<>` = required and `[]` = optional.
  Replace it and the content inside them with their respective rules.

      ```env

  TOKEN=<Your bot's token>
  CLIENT_ID=<Your bot's id>
  PREFIX=<Your bot's default prefix>
  MONGO_URI=<Your mongodb cluster url>
  TOPGG_TOKEN=<Your bot's top.gg token>
  ACTIVITY_STATUS=<Your bot's status>
  ACTIVITY_TYPE=<Your bot's activity type>
  ACTIVITY_NAME=<Your bot's custom status>
  BOT_OWNERS=<Your bot's bot owners (seperated by a ",")>
  GIVEAWAY_EVERYONE_MENTION=<If the bot should mention everyone during a giveaway>
  GIVEAWAY_HOSTED_BY=<If the bot should display the name of the host of a giveaway>
  EMBED_NEUTRAL_COLOR=<Default embed neutral color>
  EMBED_ERROR_COLOR=<Default embed error color>
  EMBED_SUCCESS_COLOR=<Default embed success color>

- Run `npm start` for production or `npm run dev` for development.
  - Test it using `[prefix]ping`

## Using this code in your own projects

You are free to use any of this project's code in your projects under the MIT License.
