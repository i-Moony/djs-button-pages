//Imports.
const { Client, EmbedBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const { ChannelPagination, NextPageButton, PreviousPageButton, StopButton, FirstPageButton, LastPageButton, CustomButton } = require("djs-button-pages");

//Array of embeds for pagination.
const embeds =
[
    new EmbedBuilder().setDescription("First page!"),
    new EmbedBuilder().setDescription("Wow! It's second page!"),
    new EmbedBuilder().setDescription("Unbelivable! Third class page!"),
    new EmbedBuilder().setDescription("Not possible! Fourth page!"),
    new EmbedBuilder().setDescription("Not probable! Special fifth page!"),
    new EmbedBuilder().setDescription("Progress! It's page with number six that is stored with number five!"),
    new EmbedBuilder().setDescription("You're feeling with determination because of the seven page!"),
    new EmbedBuilder().setDescription("You shall not pass! It's the last and the latest page!"),
];

//Array of buttons for pagination.
const buttons = 
[
    new FirstPageButton({custom_id: "first_page", label: "First Page", style: ButtonStyle.Success}),
    new PreviousPageButton({custom_id: "prev_page", label: "Previous", style: ButtonStyle.Success}), //Style can be passed either in constructor.
    new StopButton({custom_id: "stop", label: "Stop", style: ButtonStyle.Danger}),
    new NextPageButton().setStyle({custom_id: "next_page", label: "Next", style: ButtonStyle.Success}), //Or in special method.
    new LastPageButton({custom_id: "last_page", label: "Last Page", style: ButtonStyle.Success})
];

//These very bitfields are needed for this example. For DM use IntentsBitField.Flags.DirectMessages instead of Guilds and GuildMessages.
const client = new Client({intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.MessageContent]});

//Ready signal!
client.once("ready", () => {
    console.log("Ready!");
});

//Action on message.
client.on("messageCreate", async (message) => {
    //If user wrote `!pages`.
    if (message.content === "!pages")
    {
        const pagination = new ChannelPagination() //Create pagination.
            .setButtons(buttons) //Insert buttons.
            .setEmbeds(embeds) //Add embeds.
            .setTime(60000); //Set time.

        await pagination.send(message.channel); //Send!
    };
});

//Login. Replace YOUR TOKEN with token from Discord Developer Portal!
client.login("YOUR TOKEN");