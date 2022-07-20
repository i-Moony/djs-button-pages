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

Simple yet powerful module to create fully-customizable embed pages with buttons. Works with [Discord.JS](https://www.npmjs.com/package/discord.js).
Supports v13 and **v14**.

This package supports creation of custom buttons with custom scripts through a simple API.

Advantages:
* Object-oriented.
* Predictable.
* Fast.
* Customizable.

# 📥 Installation:

Requires Node.js 16.9.0 or newer (because of **Discord.JS**).
```bash
npm install djs-button-pages
```
```bash
yarn add djs-button-pages
```
```bash
pnpm add djs-button-pages
```

For v13 (requires Node.js 16.6.0 or newer):
```bash
npm install djs-button-pages@djs13
```
```bash
yarn add djs-button-pages@djs13
```
```bash
pnpm add djs-button-pages@djs13
```

# 📃 Examples:

## Basic example (previous page and next page buttons):
```javascript
const { Client, EmbedBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const { ChannelPagination, NextPageButton, PreviousPageButton } = require("djs-button-pages");

const embeds =
[
    new EmbedBuilder().setDescription("1"),
    new EmbedBuilder().setDescription("2"),
    new EmbedBuilder().setDescription("3"),
    new EmbedBuilder().setDescription("4"),
    new EmbedBuilder().setDescription("5"),
    new EmbedBuilder().setDescription("6"),
    new EmbedBuilder().setDescription("7"),
    new EmbedBuilder().setDescription("8"),
];

const buttons = 
[
    new PreviousPageButton({custom_id: "prev_page", label: "Previous", style: ButtonStyle.Success}),
    new NextPageButton().setStyle({custom_id: "next_page", label: "Next", style: ButtonStyle.Success}),
];

//These very bitfields are needed for this example.
const client = new Client({intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.MessageContent]});

client.once("ready", () => {
    console.log("Ready!");
});

client.on("messageCreate", async (message) => {
    if (message.content === "!pages")
    {
        const pagination = new ChannelPagination() //Create pagination.
            .setButtons(buttons) //Insert buttons.
            .setEmbeds(embeds) //Add embeds.
            .setTime(60000); //Set time.

        await pagination.send(message.channel); //Send!
    };
});

//Login.
client.login("YOUR TOKEN");
```

More complicated and interesting examples with commentary may be found at GitHub page.

# ❔ Links:
* [Additional Examples](https://github.com/i-Moony/djs-button-pages/tree/djs14/examples)
* [Documentation](https://i-moony.github.io/djs-button-pages/)
* [GitHub](https://github.com/i-Moony/djs-button-pages)
* [NotABug](https://notabug.org/m00ny/djs-button-pages)
* [NPM](https://www.npmjs.com/package/djs-button-pages)
* [Discord.JS](https://discord.js.org/)
* [Discord.JS Documenation](https://discord.js.org/#/docs/)
* [Discord.JS Guide](https://discordjs.guide/)

# 🐛 Bug reporting
For bug-reporting look for [GitHub Issues](https://github.com/i-Moony/djs-button-pages/issues).

Or you can DM me in Discord: `moony#6815`.

# © License:
Copyright © 2022 Danila Kononov (nickname: moony). All rights reserved.

Licensed under the Apache License, Version 2.0.