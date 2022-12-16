<div align = "center">
    <br />
    <p>
        <a href = "https://i-moony.github.io/djs-button-pages/"><img src = "https://user-images.githubusercontent.com/80977522/174433134-54e6e9f6-b618-4d94-8552-5b5ba3c22a88.png" alt = "logo" /></a>
    </p>
    <p>
        <a href = "https://www.npmjs.com/package/djs-button-pages"><img src = "https://img.shields.io/npm/v/djs-button-pages?color=FF4433&style=flat-square" alt = "npm-version" /></a>
        <a href = "https://www.npmjs.com/package/djs-button-pages"><img src = "https://img.shields.io/npm/dt/djs-button-pages?color=FF4433&style=flat-square" alt = "npm-downloads" /></a>
        <a href = "https://github.com/i-Moony/djs-button-pages"><img src = "https://img.shields.io/github/issues/i-Moony/djs-button-pages?color=FF4433&style=flat-square" alt = "github-issues" /></a>
    </p>
</div>

# 📚 About package:
### **Simple yet powerful and extensible module to create fully-customizable embed pages with buttons.**

▶️ Works with [Discord.JS](https://www.npmjs.com/package/discord.js). Supports v14. *Legacy versions support v13 and v14.*

**▶️ This packages supports creation of custom buttons with your own scripts through a simple API.**

▶️ If you want some pre-built buttons consider using [@djs-button-pages/presets](https://www.npmjs.com/package/@djs-button-pages/presets). They contain basic ones. But you can contribute some of your own to this package if you want and they may be used in other projects.

# 📥 Installation:
### Requires Node **16.9** *(because of Discord.JS)*.

```bash
npm install djs-button-pages
```
```bash
yarn add djs-button-pages
```
```bash
pnpm install djs-button-pages
```

### There are several other branches:
- **djs14-legacy**
- **djs13**
- **djs13-legacy**

# 📃 Examples:

## Basic example:
```js
//Imports.
const { Client, EmbedBuilder, ButtonStyle } = require("discord.js");
const { PaginationWrapper } = require("djs-button-pages");
//Pre-made buttons.
const { NextPageButton, PreviousPageButton } = require('@djs-button-pages/presets');

//Array of embeds for pagination.
const embeds =
[
    new EmbedBuilder().setColor("Aqua").setTitle("Test!").setDescription("Whoosh! Your first page!"),
    new EmbedBuilder().setColor("Blurple").setTitle("Test!").setDescription("Wow! It's a second one!"),
    new EmbedBuilder().setColor("DarkAqua").setTitle("Test!").setDescription("Unbelivable! Third page is available to be bought for 20$!"),
    new EmbedBuilder().setColor("DarkGold").setTitle("Test!").setDescription("Not possible! This is my fourth page!"),
    new EmbedBuilder().setColor("Gold").setTitle("Test!").setDescription("Not probable! Special fifth page!"),
    new EmbedBuilder().setColor("DarkButNotBlack").setTitle("Test!").setDescription("Wow! Another page..."),
    new EmbedBuilder().setColor("White").setTitle("Test!").setDescription("Don't tell me that it is page number seven!"),
    new EmbedBuilder().setColor("Red").setTitle("Oh, wow!").setDescription("Looks like it is the last page("),
];

//Array of buttons for pagination.
const buttons =
[
    new PreviousPageButton({custom_id: "prev_page", emoji: "◀", style: ButtonStyle.Secondary}),
    new NextPageButton({custom_id: "next_page", emoji: "▶", style: ButtonStyle.Secondary}),
];

//No intents needed.
const client = new Client({intents: []});

//Ready!
client.once("ready", async () => {
    console.log("Ready!");

    //Fetch guild that is needed.
    const guild = await client.guilds.fetch("yourGuildId");

    //Add command.
    guild.commands.create({name: "pages", description: "Testing DJS-Button-Pages!"});
});

//Catch command.
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "pages")
    {
        //Setup pagination.
        const pagination = new PaginationWrapper()
            .setButtons(buttons)
            .setEmbeds(embeds)
            .setTime(60000);

        //Send it as a reply to interaction.
        await pagination.interactionReply(interaction);
    };
});

//Login.
client.login("yourToken");
```

### More complicated examples with commentary can be found at [GitHub](https://github.com/i-Moony/djs-button-pages) page.

# ❔ Links:
* [GitHub](https://github.com/i-Moony/djs-button-pages)
* [Documentation](https://i-moony.github.io/djs-button-pages/)
* [NPM](https://www.npmjs.com/package/djs-button-pages)
* [NotABug](https://notabug.org/m00ny/djs-button-pages)
* [Discord.JS](https://discord.js.org/)
* [Discord.JS Documenation](https://discord.js.org/#/docs/)
* [Discord.JS Guide](https://discordjs.guide/)

# 🐛 Bug Reporting:
For bug reporting look for [GitHub Issues]().

Or you can DM me in Discord: `moony#6815`.

# © License:

Copyright © 2022 Danila Kononov (nickname: moony). All rights reserved.

Licensed under the Apache License, Version 2.0.