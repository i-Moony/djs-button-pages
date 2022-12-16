//Imports.
const { Client, EmbedBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const { PaginationWrapper, ButtonWrapper } = require("djs-button-pages");
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
    new ButtonWrapper({custom_id: "custom_button", label: "x2", style: ButtonStyle.Primary})
        //Setting action that doubles page number.
        //+1 -1 needed because page number is zero-based.
        .setAction(async (pagination) => {
            return pagination.setPage((pagination.page + 1) * 2 - 1).update();
        })
        //Setting switch that disables button when pagination doubled page number will be bigger than pagination has.
        .setSwitch(async (pagination) => {
            return ((pagination.page + 1) * 2 - 1) > pagination.data.embeds.length;
        }),
];

//These very intents are needed.
//For DMs use IntentBitField.Flags.DirectMessages instead of Guilds and GuildMessages.
const client = new Client({intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.MessageContent]});

//Ready!
client.once("ready", async () => {
    console.log("Ready!");
});

//Catch command.
client.on("messageCreate", async (message) => {
    if (message.content === "!pages")
    {
        //Setup pagination.
        const pagination = new PaginationWrapper()
            .setButtons(buttons)
            .setEmbeds(embeds)
            .setTime(60000);

        //Send it as a message to a certain channel.
        await pagination.send(message.channel);
    };
});

//Login.
client.login("yourToken");