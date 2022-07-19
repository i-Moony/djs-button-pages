import { MessageActionRow, MessageButton, MessageEmbed, Interaction } from "discord.js";
import InteractionPagination from "../../src/Classes/Paginations/InteractionPagination";
import FirstPageButton from "../../src/Classes/Buttons/FirstPageButton";
import Constants from "../../src/Constants";

describe("Pagination that is sent to a channel", () => {
    test("should initialize with default values.", () => {
        const pagination = new InteractionPagination();

        expect(pagination.messageOptions).toBeNull();
    });
    
    test("should initialize from another ChannelPagination.", () => {
        const pagination = new InteractionPagination()
            .setMessageOptions({allowedMentions: {repliedUser: false}})
            .setFilterOptions({noAccessReply: true, singleUserAccess: true}),
            
        { filterOptions, messageOptions } = pagination,

        newPagination = new InteractionPagination(pagination);

        expect(newPagination.filterOptions).toBe(filterOptions);
        expect(newPagination.messageOptions).toBe(messageOptions);
    });

    test("should set messageOptions and clear embeds and components fields.", () => {
        const pagination = new InteractionPagination(),
        messageOptions = {components: [new MessageActionRow<MessageButton>()], embeds: [new MessageEmbed()], allowedMentions: {repliedUser: false}, ephemeral: true}

        expect(pagination.setMessageOptions(messageOptions).messageOptions).toStrictEqual({components: [], embeds: [], allowedMentions: {repliedUser: false}, ephemeral: true});
    });

    test("setting time should fail if supplied time isn't a natural one.", () => {
        const pagination = new InteractionPagination();

        expect(() => pagination.setTime(-1)).toThrow("Time should be natural.");
        expect(() => pagination.setTime(2.5)).toThrow("Time should be natural.");
    });

    test("setting time should fail if supplied time is lesser than a minimum.", () => {
        const pagination = new InteractionPagination();

        expect(() => pagination.setTime(500)).toThrow("Pagination should exist at least one second.");
    });

    test("setting time should fail if supplied time is greater than 15 minutes.", () => {
        const pagination = new InteractionPagination();

        expect(() => pagination.setTime(Constants.DISCORD_MAX_INTERACTION_LIFE_TIME + 1)).toThrow("Total life time of InteractionPagination should be no more than fifteen minutes.");
    });

    test("sending should fail if there are no embeds.", () => {
        const pagination = new InteractionPagination()
            .setButtons(new FirstPageButton(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER")))
            .setTime(60000);

        const interactionMock:Interaction = ({} as unknown) as Interaction;

        expect(async () => await pagination.send(interactionMock)).rejects.toThrow("Pagination should have at least one button, page and settep up time.");
    });

    test("sending should fail if there are no buttons.", () => {
        const pagination = new InteractionPagination()
            .setEmbeds(new MessageEmbed().setDescription("description"))
            .setTime(60000);

        const interactionMock:Interaction = ({} as unknown) as Interaction;

        expect(async () => await pagination.send(interactionMock)).rejects.toThrow("Pagination should have at least one button, page and settep up time.");
    });

    test("sending should fail if there are no time setted up.", () => {
        const pagination = new InteractionPagination()
            .setButtons(new FirstPageButton(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER")))
            .setEmbeds(new MessageEmbed().setDescription("description"));

        const interactionMock:Interaction = ({} as unknown) as Interaction;

        expect(async () => await pagination.send(interactionMock)).rejects.toThrow("Pagination should have at least one button, page and settep up time.");
    });

    test("sending should fail if interaction is not repliable.", () => {
        const pagination = new InteractionPagination()
            .setButtons(new FirstPageButton(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER")))
            .setEmbeds(new MessageEmbed().setDescription("description"))
            .setTime(60000);

        const interactionMock:Interaction = ({isRepliable: () => false} as unknown) as Interaction;

        expect(async () => await pagination.send(interactionMock)).rejects.toThrow("Interaction should be repliable!");
    });
});