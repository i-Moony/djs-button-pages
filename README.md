![DJS-BUTTON-PAGES](https://user-images.githubusercontent.com/80977522/174433134-54e6e9f6-b618-4d94-8552-5b5ba3c22a88.png)

# 📚 About package:

Simple yet powerful module to create customizable embed pages with buttons. Works with [Discord.JS](https://www.npmjs.com/package/discord.js?source=post_page-----7b5fe27cb6fa----------------------) stating from v13.

This package supports creation of custom buttons with custom scripts through a simple API.

Advantages:
* Object-oriented.
* Predictable.
* Fast.
* Customizable.

# 📥 Installation:

Requires Node.js 16.6.0 or newer (because of **Discord.JS**).
```bash
npm install djs-button-pages
```
```bash
yarn add djs-button-pages
```
```bash
pnpm add djs-button-pages
```

# 📃 Examples:

## Basic example (previous page and next page buttons):
```javascript
const {MessageEmbed, Client, MessageButton, Intents} = require('discord.js');
const {ChannelPagination, NextPageButton, PreviousPageButton} = require("djs-button-pages");

const embeds =
[
    new MessageEmbed().setDescription("1!"),
    new MessageEmbed().setDescription("2"),
    new MessageEmbed().setDescription("3"),
    new MessageEmbed().setDescription("4"),
    new MessageEmbed().setDescription("5"),
    new MessageEmbed().setDescription("6"),
    new MessageEmbed().setDescription("7"),
    new MessageEmbed().setDescription("8"),
]

const buttons =
[
    new PreviousPageButton(new MessageButton().setCustomId("prev").setLabel("Previous").setStyle("PRIMARY")),
    new NextPageButton(new MessageButton().setCustomId("next").setLabel("Next").setStyle("PRIMARY")),
]

const client = new Client({intents: [Intents.FLAGS.GUILD, Intents.FLAGS.GUILD_MESSAGES]});

client.login("YOUR TOKEN");

client.once("ready", async () => {
    console.log("ready");
});

client.on("messageCreate", async (message) => {
    if (message.content === "!pages")
    {
        const pagination = await new ChannelPagination() //Create pagination.
            .setButtons(buttons) //Pass buttons.
            .setEmbeds(embeds) //Pass embeds.
            .setTime(60000) //Set life-time to 60000.
            .send(message.channel); //Send.
    };
});
```

More complicated and interesting examples with commentary can be found at GitHub page.
There is also documentation that you can read for more information.

# ❔ Links:
* [Additional Examples](https://github.com/i-Moony/djs-button-pages/tree/djs13/examples)
* Documentation
* [GitHub](https://github.com/i-Moony/djs-button-pages)
* [NotABug](https://notabug.org/m00ny/djs-button-pages)
* NPM
* [Discord.JS](https://discord.js.org/)
* [Discord.JS Documenation](https://discord.js.org/#/docs/)
* [Discord.JS Guide](https://discordjs.guide/)

# 🐛 Bug reporting
For bug-reporting look for [GitHub Issues](https://github.com/i-Moony/djs-button-pages/issues).

Or you can DM me in Discord: `moony#6815`.

# © License:
Copyright © 2022 Danila Kononov (nickname: moony). All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License")
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
