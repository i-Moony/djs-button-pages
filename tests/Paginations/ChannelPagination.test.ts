import { ButtonInteraction, InteractionCollector, Message, MessageActionRow, MessageButton, MessageComponentCollectorOptions, MessageEmbed, TextChannel } from "discord.js";
import ChannelPagination from "../../src/Classes/Paginations/ChannelPagination";
import FirstPageButton from "../../src/Classes/Buttons/FirstPageButton";
import LastPageButton from "../../src/Classes/Buttons/LastPageButton";
import PreviousPageButton from "../../src/Classes/Buttons/PreviousPageButton";
import NextPageButton from "../../src/Classes/Buttons/NextPageButton";
import StopButton from "../../src/Classes/Buttons/StopButton";

describe("Pagination that is sent to a channel", () => {
    test("should initialize with default values.", () => {
        const pagination = new ChannelPagination();

        expect(pagination.messageOptions).toBeNull();
    });
    
    test("should initialize from another ChannelPagination.", () => {
        const pagination = new ChannelPagination()
            .setMessageOptions({allowedMentions: {repliedUser: false}})
            .setFilterOptions({noAccessReply: true, singleUserAccess: true}),
            
        { filterOptions, messageOptions } = pagination,

        newPagination = new ChannelPagination(pagination);

        expect(newPagination.filterOptions).toBe(filterOptions);
        expect(newPagination.messageOptions).toBe(messageOptions);
    });

    test("should set messageOptions and clear embeds and components fields.", () => {
        const pagination = new ChannelPagination(),
        messageOptions = {components: [new MessageActionRow<MessageButton>()], embeds: [new MessageEmbed()], allowedMentions: {repliedUser: false}}

        expect(pagination.setMessageOptions(messageOptions).messageOptions).toStrictEqual({components: [], embeds: [], allowedMentions: {repliedUser: false}});
    });

    test("sending should fail if there are no embeds.", () => {
        const pagination = new ChannelPagination()
            .setButtons(new FirstPageButton(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER")))
            .setTime(60000);

        const channelMock:TextChannel = ({} as unknown) as TextChannel;

        expect(async () => await pagination.send(channelMock)).rejects.toThrow("Pagination should have at least one button, page and settep up time.");
    });

    test("sending should fail if there are no buttons.", () => {
        const pagination = new ChannelPagination()
            .setEmbeds(new MessageEmbed().setDescription("description"))
            .setTime(60000);

        const channelMock:TextChannel = ({} as unknown) as TextChannel;

        expect(async () => await pagination.send(channelMock)).rejects.toThrow("Pagination should have at least one button, page and settep up time.");
    });

    test("sending should fail if there are no time setted up.", () => {
        const pagination = new ChannelPagination()
            .setButtons(new FirstPageButton(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER")))
            .setEmbeds(new MessageEmbed().setDescription("description"));

        const channelMock:TextChannel = ({} as unknown) as TextChannel;

        expect(async () => await pagination.send(channelMock)).rejects.toThrow("Pagination should have at least one button, page and settep up time.");
    });

    test("should send a message.", async () => {
        const pagination = new ChannelPagination()
            .setButtons(new FirstPageButton(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER")))
            .setEmbeds(new MessageEmbed().setDescription("description"))
            .setTime(60000),

        interactionCollectorMock:InteractionCollector<ButtonInteraction> = ({on: jest.fn()} as unknown) as InteractionCollector<ButtonInteraction>,
        messageMock:Message = ({createMessageComponentCollector: jest.fn(() => interactionCollectorMock)} as unknown) as Message,
        channelMock:TextChannel = ({send: jest.fn(() => messageMock)} as unknown) as TextChannel;

        await pagination.send(channelMock);

        expect(channelMock.send).toHaveBeenCalledWith({
            embeds: [new MessageEmbed().setDescription("description")],
            components: [new MessageActionRow().setComponents(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER").setDisabled(true))]
        });
    });

    test("should execute afterSending action.", async () => {
        const actionAfterSending = jest.fn(),
        
        pagination = new ChannelPagination()
            .setAfterSendingAction(actionAfterSending)
            .setButtons(new FirstPageButton(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER")))
            .setEmbeds(new MessageEmbed().setDescription("description"))
            .setTime(60000),

        interactionCollectorMock:InteractionCollector<ButtonInteraction> = ({on: jest.fn()} as unknown) as InteractionCollector<ButtonInteraction>,
        messageMock:Message = ({createMessageComponentCollector: jest.fn(() => interactionCollectorMock)} as unknown) as Message,
        channelMock:TextChannel = ({send: jest.fn(() => messageMock)} as unknown) as TextChannel;

        await pagination.send(channelMock);

        expect(actionAfterSending).toHaveBeenCalledWith(messageMock);
    });

    test("all methods that change class properties should throw errors.", async () => {
        const pagination = new ChannelPagination()
            .setButtons(new FirstPageButton(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER")))
            .setEmbeds(new MessageEmbed().setDescription("description"))
            .setTime(60000),

        interactionCollectorMock:InteractionCollector<ButtonInteraction> = ({on: jest.fn()} as unknown) as InteractionCollector<ButtonInteraction>,
        messageMock:Message = ({createMessageComponentCollector: jest.fn(() => interactionCollectorMock)} as unknown) as Message,
        channelMock:TextChannel = ({send: jest.fn(() => messageMock)} as unknown) as TextChannel;

        await pagination.send(channelMock);

        await expect(async () => await pagination.send(channelMock)).rejects.toThrow("The pagination is already sent.");
        expect(() => pagination.setTime(60000)).toThrow("The pagination is already sent.");
        expect(() => pagination.setOnStopAction(() => {})).toThrow("The pagination is already sent.");
        expect(() => pagination.setMessageOptions({stickers: []})).toThrow("The pagination is already sent.");
        expect(() => pagination.setEmbeds(new MessageEmbed().setDescription("description"))).toThrow("The pagination is already sent.");
        expect(() => pagination.setCollectorOptions({maxIdleTime: 10})).toThrow("The pagination is already sent.");
        expect(() => pagination.setButtons(new FirstPageButton(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER")))).toThrow("The pagination is already sent.");
        expect(() => pagination.setAfterSendingAction(() => {})).toThrow("The pagination is already sent.");
        expect(() => pagination.removeEmbeds(1)).toThrow("The pagination is already sent.");
        expect(() => pagination.insertEmbeds(new MessageEmbed().setDescription("description"))).toThrow("The pagination is already sent.");
        expect(() => pagination.setFilterOptions({singleUserAccess: true})).toThrow("The pagination is already sent.");
    });

    test("filter should filter out messages with another ids.", async () => {
        const pagination = new ChannelPagination()
            .setButtons(new FirstPageButton(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER")))
            .setEmbeds(new MessageEmbed().setDescription("description"))
            .setTime(60000),

        interactionCollectorMock:InteractionCollector<ButtonInteraction> = ({on: jest.fn(), constructor: jest.fn()} as unknown) as InteractionCollector<ButtonInteraction>,
        collectorMock = jest.fn((data:MessageComponentCollectorOptions<ButtonInteraction>) => interactionCollectorMock),
        messageMock:Message = ({createMessageComponentCollector: collectorMock, id: 1} as unknown) as Message,
        channelMock:TextChannel = ({send: jest.fn(() => messageMock)} as unknown) as TextChannel;

        await pagination.send(channelMock);

        if (!collectorMock.mock.calls[0][0].filter)
            throw new Error("Filter should be defined!");

        const interactionMock:ButtonInteraction = ({message: {id: 2}} as unknown) as ButtonInteraction,

        result = await collectorMock.mock.calls[0][0].filter(interactionMock);

        expect(result).toBeFalsy();
    });

    test("should set interactionCollector events' scripts.", async () => {
        const pagination = new ChannelPagination()
            .setButtons(new FirstPageButton(new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("DANGER")))
            .setEmbeds(new MessageEmbed().setDescription("description"))
            .setTime(60000),

        mockOn = jest.fn(),
        interactionCollectorMock:InteractionCollector<ButtonInteraction> = ({on: mockOn} as unknown) as InteractionCollector<ButtonInteraction>,
        messageMock:Message = ({createMessageComponentCollector: jest.fn(() => interactionCollectorMock)} as unknown) as Message,
        channelMock:TextChannel = ({send: jest.fn(() => messageMock)} as unknown) as TextChannel;

        await pagination.send(channelMock);

        expect(mockOn).toHaveBeenCalledTimes(2);
        expect(mockOn.mock.calls[0][0]).toBe("collect");
        expect(mockOn.mock.calls[0][1]).toBeInstanceOf(Function);
        expect(mockOn.mock.calls[1][0]).toBe("end");
        expect(mockOn.mock.calls[1][1]).toBeInstanceOf(Function);
    });

    test("should edit message on collect.", async () => {
        const buttonStyles = 
        [
            new MessageButton().setCustomId("first").setLabel("First").setStyle("SUCCESS"),
            new MessageButton().setCustomId("prev").setLabel("Previous").setStyle("PRIMARY"),
            new MessageButton().setCustomId("stop").setLabel("Stop").setStyle("DANGER"),
            new MessageButton().setCustomId("next").setLabel("Next").setStyle("PRIMARY"),
            new MessageButton().setCustomId("last").setLabel("Last").setStyle("SUCCESS")
        ],
        
        buttons = 
        [
            new FirstPageButton(buttonStyles[0]),
            new PreviousPageButton(buttonStyles[1]),
            new StopButton(buttonStyles[2]),
            new NextPageButton(buttonStyles[3]),
            new LastPageButton(buttonStyles[4])
        ],
        
        embeds =
        [
            new MessageEmbed().setColor("RANDOM").setDescription("First page!"),
            new MessageEmbed().setColor("RANDOM").setDescription("Wow! It's second page!"),
            new MessageEmbed().setColor("RANDOM").setDescription("Unbelivable! Third class page!"),
            new MessageEmbed().setColor("RANDOM").setDescription("Not possible! Fourth page!"),
            new MessageEmbed().setColor("RANDOM").setDescription("Not probable! Special fifth page!"),
            new MessageEmbed().setColor("RANDOM").setDescription("Progress! It's page with number six that is stored with number five!"),
            new MessageEmbed().setColor("RANDOM").setDescription("You're feeling with determination because of the seven page!"),
            new MessageEmbed().setColor("RANDOM").setDescription("You shall not pass! It's the last and the latest page!"),
        ],

        pagination = new ChannelPagination()
            .setFilterOptions({resetTimer: true})
            .setButtons(buttons)
            .setEmbeds(embeds)
            .setTime(60000),

        mockOn = jest.fn(),
        editMock = jest.fn(),
        interactionCollectorMock:InteractionCollector<ButtonInteraction> = ({on: mockOn, resetTimer: jest.fn()} as unknown) as InteractionCollector<ButtonInteraction>,
        messageMock:Message = ({createMessageComponentCollector: jest.fn(() => interactionCollectorMock)} as unknown) as Message,
        channelMock:TextChannel = ({send: jest.fn(() => messageMock)} as unknown) as TextChannel;

        await pagination.send(channelMock);
    
        const collectEvent = mockOn.mock.calls[0][1];

        let interactionMock:ButtonInteraction = ({customId: "last", deferUpdate: jest.fn(), editReply: editMock} as unknown) as ButtonInteraction;
        await collectEvent(interactionMock);

        interactionMock = ({customId: "prev", deferUpdate: jest.fn(), editReply: editMock} as unknown) as ButtonInteraction;
        await collectEvent(interactionMock);

        interactionMock = ({customId: "next", deferUpdate: jest.fn(), editReply: editMock} as unknown) as ButtonInteraction;
        await collectEvent(interactionMock);

        interactionMock = ({customId: "first", deferUpdate: jest.fn(), editReply: editMock} as unknown) as ButtonInteraction;
        await collectEvent(interactionMock);

        expect(editMock.mock.calls[0][0]).toStrictEqual({embeds: [embeds[embeds.length - 1]], components: [new MessageActionRow().setComponents([
            buttonStyles[0],
            buttonStyles[1],
            buttonStyles[2],
            buttonStyles[3].setDisabled(true),
            buttonStyles[4].setDisabled(true)
        ])]});

        expect(editMock.mock.calls[1][0]).toStrictEqual({embeds: [embeds[embeds.length - 2]], components: [new MessageActionRow().setComponents([
            buttonStyles[0],
            buttonStyles[1],
            buttonStyles[2],
            buttonStyles[3],
            buttonStyles[4]
        ])]});

        expect(editMock.mock.calls[2][0]).toStrictEqual({embeds: [embeds[embeds.length - 1]], components: [new MessageActionRow().setComponents([
            buttonStyles[0],
            buttonStyles[1],
            buttonStyles[2],
            buttonStyles[3].setDisabled(true),
            buttonStyles[4].setDisabled(true)
        ])]});

        expect(editMock.mock.calls[3][0]).toStrictEqual({embeds: [embeds[0]], components: [new MessageActionRow().setComponents([
            buttonStyles[0].setDisabled(true),
            buttonStyles[1].setDisabled(true),
            buttonStyles[2],
            buttonStyles[3],
            buttonStyles[4]
        ])]});
    });

    test("should stop pagination and trigger onStop action if stop button is triggered.", async () => {
        const buttons = 
        [
            new FirstPageButton(new MessageButton().setCustomId("first").setLabel("First").setStyle("SUCCESS")),
            new PreviousPageButton(new MessageButton().setCustomId("prev").setLabel("Previous").setStyle("PRIMARY")),
            new StopButton(new MessageButton().setCustomId("stop").setLabel("Stop").setStyle("DANGER")),
            new NextPageButton(new MessageButton().setCustomId("next").setLabel("Next").setStyle("PRIMARY")),
            new LastPageButton(new MessageButton().setCustomId("last").setLabel("Last").setStyle("SUCCESS"))
        ],
        
        embeds =
        [
            new MessageEmbed().setColor("RANDOM").setDescription("First page!"),
            new MessageEmbed().setColor("RANDOM").setDescription("Wow! It's second page!"),
            new MessageEmbed().setColor("RANDOM").setDescription("Unbelivable! Third class page!"),
            new MessageEmbed().setColor("RANDOM").setDescription("Not possible! Fourth page!"),
            new MessageEmbed().setColor("RANDOM").setDescription("Not probable! Special fifth page!"),
            new MessageEmbed().setColor("RANDOM").setDescription("Progress! It's page with number six that is stored with number five!"),
            new MessageEmbed().setColor("RANDOM").setDescription("You're feeling with determination because of the seven page!"),
            new MessageEmbed().setColor("RANDOM").setDescription("You shall not pass! It's the last and the latest page!"),
        ],

        pagination = new ChannelPagination()
            .setFilterOptions({resetTimer: true, removeButtonsOnEnd: true})
            .setOnStopAction(jest.fn())
            .setButtons(buttons)
            .setEmbeds(embeds)
            .setTime(60000),

        mockOn = jest.fn(),
        editMock = jest.fn(),
        interactionCollectorMock:InteractionCollector<ButtonInteraction> = ({on: mockOn, stop: jest.fn()} as unknown) as InteractionCollector<ButtonInteraction>,
        messageMock:Message = Object.assign(Object.create(Message.prototype), {createMessageComponentCollector: jest.fn(() => interactionCollectorMock)}),
        channelMock:TextChannel = ({send: jest.fn(() => messageMock)} as unknown) as TextChannel;

        jest.spyOn(Message.prototype, 'editable', 'get').mockImplementation(() => true);
        jest.spyOn(Message.prototype, 'edit').mockImplementation(editMock);
        
        await pagination.send(channelMock);
    
        const collectEvent = mockOn.mock.calls[0][1],
        stopEvent = mockOn.mock.calls[1][1],
        interactionMock:ButtonInteraction = ({customId: "stop", deferUpdate: jest.fn()} as unknown) as ButtonInteraction;

        await collectEvent(interactionMock);

        expect(interactionCollectorMock.stop).toHaveBeenCalled();

        await stopEvent(new Map(), 'user');

        expect(editMock).toHaveBeenCalled();
        expect(editMock.mock.calls[0][0]).toStrictEqual({components: []});
        expect(pagination.onStop).toHaveBeenCalledWith('user');
    });
});