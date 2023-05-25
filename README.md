<div align = "center">
    <br>
    <p>
        <a href = "https://i-moony.github.io/djs-button-pages/">
            <img src = "./assets/djs-button-pages-cropped.png" alt = "logo" />
        </a>
    </p>
    <p>
        <a href = "https://www.npmjs.com/package/djs-button-pages">
            <img src = "https://img.shields.io/npm/v/djs-button-pages?color=FF4433&style=for-the-badge" alt = "npm-version" />
        </a>
        <a href = "https://www.npmjs.com/package/djs-button-pages">
            <img src = "https://img.shields.io/npm/dt/djs-button-pages?color=FF4433&style=for-the-badge" alt = "npm-downloads" />
        </a>
        <a href = "https://github.com/i-Moony/djs-button-pages">
            <img src = "https://img.shields.io/github/issues/i-Moony/djs-button-pages?color=FF4433&style=for-the-badge" alt = "github-issues" />
        </a>
    </p>
    <p>
        <a href = "https://discord.gg/WRKyCpHRAP">
            <img src = "https://img.shields.io/discord/1094672489180844164?color=%235164e3&label=Discord&logo=Discord&logoColor=%23FFFFFF&style=for-the-badge" />
        </a>
    </p>
    <img src = "./assets/showcase.gif" alt = "Library in action" title = "Library in action" />
</div>
<br>

# 📚 About package:
### **Simple yet powerful and extensible module to create fully-customizable embed pages with buttons.**

▶️ Works with [Discord.JS](https://www.npmjs.com/package/discord.js). Supports v14. *Legacy versions support v13 and v14.*

**▶️ This packages supports creation of custom buttons with your own scripts through a simple API.**

▶️ If you want some pre-built buttons consider using [@djs-button-pages/presets](https://www.npmjs.com/package/@djs-button-pages/presets). They contain basic ones *(But you can contribute some of your own to this package if you want to)*.

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
// Imports.
const { Client, EmbedBuilder, ButtonStyle } = require("discord.js");
const { PaginationWrapper } = require("djs-button-pages");
// Pre-made buttons.
const { NextPageButton, PreviousPageButton } = require('@djs-button-pages/presets');

const embeds =
[
    // Array of embeds for pagination.
];

// Array of buttons for pagination.
const buttons =
[
    new PreviousPageButton
    ({
        custom_id: "prev_page",
        emoji: "◀",
        style: ButtonStyle.Secondary
    }),
    new NextPageButton
    ({
        custom_id: "next_page",
        emoji: "▶",
        style: ButtonStyle.Secondary
    }),
];

// No intents needed for this example.
const client = new Client({intents: []});

// Catch command.
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "pages")
    {
        // Setup pagination.
        const pagination = new PaginationWrapper()
            .setButtons(buttons)
            .setEmbeds(embeds)
            .setTime(60000);

        // Send it as a reply to interaction.
        await pagination.interactionReply(interaction);
        // Everything else will be done for you!
    };
});
```

### More interesting examples with commentary can be found at [GitHub](https://github.com/i-Moony/djs-button-pages) page.

# ❔ Links:
* [GitHub](https://github.com/i-Moony/djs-button-pages)
* [Documentation](https://i-moony.github.io/djs-button-pages/)
* [NPM](https://www.npmjs.com/package/djs-button-pages)
* [NotABug](https://notabug.org/m00ny/djs-button-pages)
* [Discord Server](https://discord.gg/WRKyCpHRAP)
* [Discord.JS](https://discord.js.org/)
* [Discord.JS Documenation](https://discord.js.org/#/docs/)
* [Discord.JS Guide](https://discordjs.guide/)

# 🐛 Bug Reporting:
For bug reporting look for [GitHub Issues](https://github.com/i-Moony/djs-button-pages/issues).

If you need support, you can join my [Discord Server](https://discord.gg/WRKyCpHRAP).

# © License:

Copyright © 2022 Danila Kononov (nickname: moony). All rights reserved.

Licensed under the Apache License, Version 2.0.