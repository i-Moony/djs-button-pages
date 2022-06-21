const {MessageEmbed, Client, MessageButton, Intents} = require('discord.js');
const {ChannelPagination, NextPageButton, PreviousPageButton, StopButton, FirstPageButton, LastPageButton, CustomButton} = require("djs-button-pages");

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
    new FirstPageButton(new MessageButton().setCustomId("first").setLabel("First").setStyle("SUCCESS")),
    new PreviousPageButton(new MessageButton().setCustomId("prev").setLabel("Previous").setStyle("PRIMARY")),
    new StopButton(new MessageButton().setCustomId("stop").setLabel("Stop").setStyle("DANGER")),
    new NextPageButton(new MessageButton().setCustomId("next").setLabel("Next").setStyle("PRIMARY")),
    //ALSO CAN BE: new NextPageButton().setStyle(new MessageButton().setCustomId("next").setLabel("Next").setStyle("PRIMARY"))
    new LastPageButton(new MessageButton().setCustomId("last").setLabel("Last").setStyle("SUCCESS")),
    new CustomButton(new MessageButton().setCustomId("x2").setLabel("Double Page").setStyle("SECONDARY"))
        .setAction((pagination) => (pagination.currentPage + 1) * 2 - 1)
        .setDisableWhen((pagination, nextPage) => nextPage > pagination.embeds.length / 2 - 1 ? nextPage : -1),
]

//Client flags. These are for guilds. For DMs needs `Intents.FLAGS.DIRECT_MESSAGES`.
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

//Replace YOUR TOKEN with the token from Discord Developer Portal.
client.login("YOUR TOKEN");

//Ready!
client.once("ready", async () => {
    console.log("ready");
});

//On message.
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