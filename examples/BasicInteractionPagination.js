const {MessageEmbed, Client, MessageButton, Intents} = require('discord.js');
const {NextPageButton, PreviousPageButton, InteractionPagination} = require("djs-button-pages");

//Array of embeds for pagination.
const embeds =
[
    new MessageEmbed().setColor("RANDOM").setDescription("First page!"),
    new MessageEmbed().setColor("RANDOM").setDescription("Wow! It's second page!"),
    new MessageEmbed().setColor("RANDOM").setDescription("Unbelivable! Third class page!"),
    new MessageEmbed().setColor("RANDOM").setDescription("Not possible! Fourth page!"),
    new MessageEmbed().setColor("RANDOM").setDescription("Not probable! Special fifth page!"),
    new MessageEmbed().setColor("RANDOM").setDescription("Progress! It's page with number six that is stored with number five!"),
    new MessageEmbed().setColor("RANDOM").setDescription("You're feeling with determination because of the seven page!"),
    new MessageEmbed().setColor("RANDOM").setDescription("You shall not pass! It's the last and the latest page!"),
]

//Array of buttons for pagination.
const buttons =
[
    new PreviousPageButton(new MessageButton().setCustomId("prev").setLabel("Previous").setStyle("PRIMARY")),
    new NextPageButton(new MessageButton().setCustomId("next").setLabel("Next").setStyle("PRIMARY")),
    //ALSO CAN BE: new NextPageButton().setStyle(new MessageButton().setCustomId("next").setLabel("Next").setStyle("PRIMARY"))
]

//Client flags are not needed for this example of usage.
const client = new Client({intents: []});

//Replace YOUR TOKEN with the token from Discord Developer Portal.
client.login("YOUR TOKEN");

//Ready!
client.once("ready", async () => {
    console.log("ready");

    //Create guild command (Replace YOUR GUILD with the GuildID of you Guild). If you want to make global command head to Discord.JS documentation.
    const guild = await client.guilds.fetch("YOUR GUILD");

    guild.commands.create({name: "pages", description: "Sample pages."});
});

//On interaction.
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "pages")
    {
        const pagination = await new InteractionPagination() //Create pagination.
            .setButtons(buttons) //Pass buttons.
            .setEmbeds(embeds) //Pass embeds.
            .setTime(60000) //Set life-time to 60000.
            .send(interaction); //Send.
    };
});