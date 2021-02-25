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

    ```
    TOKEN=<Your bot's token>
    CLIENT_ID=<Your bot ID>
    PREFIX=<Prefix>
    MONGO_URI=<Your Mongodb cluster connection URI>
    SECRET=<Your bot's secret>
    DASHBOARD_URL=<Your base dashboard URL>
    ACTIVITY_STATUS=<Your bot's status>
    ACTIVITY_TYPE=<Bot's activity type>
    ACTIVITY_NAME=<Bot's activity>
    TOPGG_TOKEN=[Your bot's Top.gg token]
    ```
- Make a new folder called `config`
    - Inside the folder make a new file called `config.json`
    - Paste the following contents:
        ```json
        {
            "botOwners": [""],
            "everyoneMention": false,
            "hostedBy": true
        }
        ```
    - You can put your own bot owners in the array.
- Run `node .` in your terminal and voila! It
  should run smoothly!
    - Test it using `[prefix]ping`

## Using this code in your own projects
You are free to use any of this project's code in your projects under the MIT License.
