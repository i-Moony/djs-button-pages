//Imports.
const { Client, EmbedBuilder, ButtonStyle } = require("discord.js");
const { InteractionPagination, NextPageButton, PreviousPageButton } = require("djs-button-pages");

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
    new PreviousPageButton({custom_id: "prev_page", label: "Previous", style: ButtonStyle.Success}), //Style can be passed either in constructor.
    new NextPageButton().setStyle({custom_id: "next_page", label: "Next", style: ButtonStyle.Success}), //Or in special method.
];

//No intents needed for this example.
const client = new Client({intents: []});

//Ready signal!
client.once("ready", async () => {
    console.log("Ready!");

    //Search for guild. Replace YOUR GUILD ID with your guild id.
    const guild = await client.guilds.fetch("YOUR GUILD ID");

    guild.commands.create({name: "pages", description: "Sample pages."});
});

//Action on interaction.
client.on("interactionCreate", async (interaction) => {
    //If user used pages command.
    if (interaction.isCommand() && interaction.commandName === "pages")
    {
        const pagination = new InteractionPagination() //Create pagination.
            .setButtons(buttons) //Insert buttons.
            .setEmbeds(embeds) //Add embeds.
            .setTime(60000); //Set time.

        await pagination.send(interaction); //Send!
    };
});

//Login. Replace YOUR TOKEN with token from Discord Developer Portal!
client.login("YOUR TOKEN");