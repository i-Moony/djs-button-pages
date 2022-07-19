import { MessageButton, MessageEmbed } from "discord.js";
import PaginationData from "../../../src/Classes/Paginations/Basic/PaginationData";
import Constants from "../../../src/Constants";
import FirstPageButton from "../../../src/Classes/Buttons/FirstPageButton";
import ButtonData from "../../../src/Classes/Buttons/Basic/ButtonData";

describe("Data that is necessary", () => {
    test("should initialize with default values.", () => {
        const pagination = new PaginationData();

        expect(pagination.time).toBeNull();
        expect(pagination.onStop).toBeNull();
        expect(pagination.isActive).toBeFalsy();
        expect(pagination.filterOptions).toStrictEqual({singleUserAccess: true, noAccessReply: true, noAccessReplyContent: "You're disallowed to use this very pagination!"});
        expect(pagination.embeds).toBeNull();
        expect(pagination.currentPage).toBe(0);
        expect(pagination.collectorOptions).toBeNull();
        expect(pagination.collector).toBeNull();
        expect(pagination.buttons).toBeNull();
        expect(pagination.afterSending).toBeNull();
    });

    test("should set afterSending action.", () => {
        const afterSending = () => {
            return;
        },
        pagination = new PaginationData();

        expect(pagination.setAfterSendingAction(afterSending).afterSending).toBe(afterSending);
    });

    test("should set onStop action.", () => {
        const onStop = () => {
            return;
        },
        pagination = new PaginationData();

        expect(pagination.setOnStopAction(onStop).onStop).toBe(onStop);
    });

    test("setTime should throw error if supplied number is not natural.", () => {
        const pagination = new PaginationData();

        expect(() => pagination.setTime(5.5)).toThrow("Time should be natural.");

        expect(() => pagination.setTime(-2)).toThrow("Time should be natural.");
    });

    test("setTime should throw error if supplied number didn't bypass lowest library limit.", () => {
        const pagination = new PaginationData();

        expect(() => pagination.setTime(Constants.LIBRARY_MIN_PAGES_LIFE_TIME - 1)).toThrow("Pagination should exist at least one second.");
    });

    test("setTime should throw error if supplied number didn't bypass highest library limit.", () => {
        const pagination = new PaginationData();

        expect(() => pagination.setTime(Constants.LIBRARY_MAX_PAGES_LIFE_TIME + 1)).toThrow("Pagination total life time should be no more than an hour due to optimization. If you want to bypass the limit, pass true as the second argument to this method.");
    });

    test("setTime should accept number that is greater than highest library limit if bypassLibraryLimits is true.", () => {
        const pagination = new PaginationData();

        expect(pagination.setTime(Constants.LIBRARY_MAX_PAGES_LIFE_TIME + 1, true).time).toBe(Constants.LIBRARY_MAX_PAGES_LIFE_TIME + 1);
    });

    test("setTime should accept normal numbers.", () => {
        const pagination = new PaginationData();

        expect(pagination.setTime(Constants.LIBRARY_MIN_PAGES_LIFE_TIME + 1).time).toBe(Constants.LIBRARY_MIN_PAGES_LIFE_TIME + 1);
    });

    test("insertEmbeds should throw error if some of the embeds are empty.", () => {
        const pagination = new PaginationData(),
        embeds = [new MessageEmbed().setDescription("description"), new MessageEmbed()];

        expect(() => pagination.insertEmbeds(embeds)).toThrow("No embeds from the array can be empty.");
    });

    test("insertEmbeds should throw error if some of the embeds are longer than Discord's limits.", () => {
        const pagination = new PaginationData(),
        text = new Array(Constants.DISCORD_MAX_EMBED_LENGTH + 2).join("a"),
        embeds = [new MessageEmbed().setDescription("description"), new MessageEmbed().setDescription(text)];

        expect(() => pagination.insertEmbeds(embeds)).toThrow(`No embeds from the array can be longer than ${Constants.DISCORD_MAX_EMBED_LENGTH}.`);
    });

    test("insertEmbeds should throw error if index is not natural.", () => {
        const pagination = new PaginationData(),
        embeds = [new MessageEmbed().setDescription("description"), new MessageEmbed().setDescription("description")];

        expect(() => pagination.insertEmbeds(embeds, -1)).toThrow("Index should be natural.");
        expect(() => pagination.insertEmbeds(embeds, 2.5)).toThrow("Index should be natural.");
    });

    test("insertEmbeds should set array with old embeds and new.", () => {
        const pagination = new PaginationData(),
        embeds = [new MessageEmbed().setDescription("description"), new MessageEmbed().setDescription("description")];

        expect(pagination.insertEmbeds(embeds).embeds).toStrictEqual(embeds);

        const anotherEmbed = new MessageEmbed().setDescription("another description");

        expect(pagination.insertEmbeds(anotherEmbed).embeds).toStrictEqual([...embeds, anotherEmbed]);
        expect(pagination.insertEmbeds(anotherEmbed, 0).embeds).toStrictEqual([anotherEmbed, ...embeds, anotherEmbed]);
    });

    test("removeEmbeds should throw error if index is not natural.", () => {
        const pagination = new PaginationData();

        expect(() => pagination.removeEmbeds(-1)).toThrow("Index should be natural.");
        expect(() => pagination.removeEmbeds(2.5)).toThrow("Index should be natural.");
    });

    test("removeEmbeds should throw error if count is not natural or equals to zero.", () => {
        const pagination = new PaginationData();

        expect(() => pagination.removeEmbeds(2, -1)).toThrow("Count should be natural and greater than zero.");
        expect(() => pagination.removeEmbeds(2, 2.5)).toThrow("Count should be natural and greater than zero.");
        expect(() => pagination.removeEmbeds(2, 0)).toThrow("Count should be natural and greater than zero.");
    });

    test("removeEmbeds should remove embeds with specified parameters.", () => {
        const pagination = new PaginationData(),
        embeds = [new MessageEmbed().setDescription("description 1"), new MessageEmbed().setDescription("description 2"), new MessageEmbed().setDescription("description 3"), new MessageEmbed().setDescription("description 4")];

        pagination.insertEmbeds(embeds);

        expect(pagination.removeEmbeds(0, 4).embeds).toBeNull();

        pagination.insertEmbeds(embeds);

        expect(pagination.removeEmbeds(0).embeds).toStrictEqual([new MessageEmbed().setDescription("description 2"), new MessageEmbed().setDescription("description 3"), new MessageEmbed().setDescription("description 4")]);
    });

    test("setEmbeds should throw error if some of the embeds are empty.", () => {
        const pagination = new PaginationData(),
        embeds = [new MessageEmbed().setDescription("description"), new MessageEmbed()];

        expect(() => pagination.setEmbeds(embeds)).toThrow("No embeds from the array can be empty.");
    });

    test("setEmbeds should throw error if some of the embeds are longer than Discord's limits.", () => {
        const pagination = new PaginationData(),
        text = new Array(Constants.DISCORD_MAX_EMBED_LENGTH + 2).join("a"),
        embeds = [new MessageEmbed().setDescription("description"), new MessageEmbed().setDescription(text)];

        expect(() => pagination.setEmbeds(embeds)).toThrow(`No embeds from the array can be longer than ${Constants.DISCORD_MAX_EMBED_LENGTH}.`);
    });

    test("setEmbeds should override previous embeds.", () => {
        const pagination = new PaginationData(),
        embeds = [new MessageEmbed().setDescription("description"), new MessageEmbed().setDescription("description")];

        expect(pagination.setEmbeds(embeds).embeds).toBe(embeds);

        const anotherEmbed = new MessageEmbed().setDescription("another description");

        expect(pagination.setEmbeds(anotherEmbed).embeds).toStrictEqual([anotherEmbed]);
    });

    test("setButtons should throw error if there are more buttons than Discord's Limit.", () => {
        const pagination = new PaginationData(),
        buttons:Array<ButtonData> = new Array(Constants.DISCORD_MAX_BUTTONS_PER_ROW * Constants.DISCORD_MAX_ROWS_PER_MESSAGE + 1).fill(new FirstPageButton());

        expect(() => pagination.setButtons(buttons)).toThrow(`There can not be more than ${Constants.DISCORD_MAX_BUTTONS_PER_ROW * Constants.DISCORD_MAX_ROWS_PER_MESSAGE} buttons per message because of Discord's limit.`);
    });

    test("setButtons should throw error if there are buttons with similar customIds.", () => {
        const pagination = new PaginationData(),
        buttons = [new FirstPageButton().setStyle(new MessageButton().setCustomId("testid").setLabel("firstLabel").setStyle("DANGER")), new FirstPageButton().setStyle(new MessageButton().setCustomId("testid").setLabel("secondLabel").setStyle("PRIMARY"))];

        expect(() => pagination.setButtons(buttons)).toThrow("Buttons can not have similar customIds.");
    });

    test("setButtons should override previous buttons.", () => {
        const pagination = new PaginationData(),
        buttons = [new FirstPageButton().setStyle(new MessageButton().setCustomId("testid").setLabel("firstLabel").setStyle("DANGER")), new FirstPageButton().setStyle(new MessageButton().setCustomId("testid2").setLabel("secondLabel").setStyle("PRIMARY"))];

        expect(pagination.setButtons(buttons).buttons).toBe(buttons);

        const anotherButton = new FirstPageButton().setStyle(new MessageButton().setCustomId("testid3").setLabel("thirdLabel").setStyle("DANGER"));

        expect(pagination.setButtons(anotherButton).buttons).toStrictEqual([anotherButton]);
    });

    test("getButtonByCustomId should return undefined if there are no buttons with this customId.", () => {
        const pagination = new PaginationData();

        expect(pagination.getButtonByCustomId("undefined")).toBeUndefined();
    });

    test("getButtonByCustomId should return ButtonData if there is button with this customId.", () => {
        const pagination = new PaginationData(),
        button = new FirstPageButton().setStyle(new MessageButton().setCustomId("testid").setLabel("label").setStyle("DANGER"));

        pagination.setButtons(button);

        expect(pagination.getButtonByCustomId("testid")).toBe(button);
    });

    test("setFilterOptions should throw error if noAccessReplyContent is too short.", () => {
        const pagination = new PaginationData(),
        filterOptions = {noAccessReplyContent: ""};

        expect(() => pagination.setFilterOptions(filterOptions)).toThrow("Reply should be longer than zero symbols.");
    });

    test("setFilterOptions should set options if everything is fine.", () => {
        const pagination = new PaginationData(),
        filterOptions = {singleUserAccess: true, noAccessReply: true, noAccessReplyContent: "You're disallowed to use this very pagination!"};

        expect(pagination.setFilterOptions(filterOptions).filterOptions).toBe(filterOptions);
    });

    test("setCollectorOptions should throw error if maxIdleTime is not a natural number.", () => {
        const pagination = new PaginationData(),
        firstCollectorOptions = {maxIdleTime: -2},
        secondCollectorOptions = {maxIdleTime: 2.5};

        expect(() => pagination.setCollectorOptions(firstCollectorOptions)).toThrow("Max collector's idle time should be a natural number!");

        expect(() => pagination.setCollectorOptions(secondCollectorOptions)).toThrow("Max collector's idle time should be a natural number!");
    });

    test("setCollectorOptions should throw error if maxInteractions is not a natural number.", () => {
        const pagination = new PaginationData(),
        firstCollectorOptions = {maxInteractions: -2},
        secondCollectorOptions = {maxInteractions: 2.5};

        expect(() => pagination.setCollectorOptions(firstCollectorOptions)).toThrow("Max number of interactions should be a natural number!");

        expect(() => pagination.setCollectorOptions(secondCollectorOptions)).toThrow("Max number of interactions should be a natural number!");
    });

    test("setCollectorOptions should throw error if maxUsers is not a natural number.", () => {
        const pagination = new PaginationData(),
        firstCollectorOptions = {maxUsers: -2},
        secondCollectorOptions = {maxUsers: 2.5};

        expect(() => pagination.setCollectorOptions(firstCollectorOptions)).toThrow("Max number of users should be a natural number!");

        expect(() => pagination.setCollectorOptions(secondCollectorOptions)).toThrow("Max number of users should be a natural number!");
    });

    test("setCollectorOptions should set collectorOptions if everything is fine.", () => {
        const pagination = new PaginationData(),
        collectorOptions = {maxIdleTime: 1000, maxInteractions: 25, maxUsers: 10};

        expect(pagination.setCollectorOptions(collectorOptions).collectorOptions).toBe(collectorOptions);
    });

    test("should initialize from another class.", () => {
        const previousPagination = new PaginationData()
            .setFilterOptions({singleUserAccess: true, noAccessReply: true, noAccessReplyContent: "Some cool reply!"})
            .setCollectorOptions({maxIdleTime: 20, maxInteractions: 20, maxUsers: 15})
            .setOnStopAction(() => 1)
            .setAfterSendingAction(() => 2)
            .setTime(20000)
            .setEmbeds(new MessageEmbed().setDescription("some cool description"))
            .setButtons(new FirstPageButton().setStyle(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER"))),
            
        { filterOptions, collectorOptions, onStop, afterSending, time, embeds, buttons } = previousPagination,

        newPagination = new PaginationData(previousPagination);

        expect(newPagination.afterSending).toBe(afterSending);
        expect(newPagination.buttons).toBe(buttons);
        expect(newPagination.collectorOptions).toBe(collectorOptions);
        expect(newPagination.embeds).toBe(embeds);
        expect(newPagination.filterOptions).toBe(filterOptions);
        expect(newPagination.onStop).toBe(onStop)
        expect(newPagination.time).toBe(time);
    });
});