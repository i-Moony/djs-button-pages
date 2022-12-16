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