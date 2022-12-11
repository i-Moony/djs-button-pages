import { EmbedBuilder } from "discord.js";
import { PaginationWrapper,
    ButtonWrapper,
    Constants } from "../../src/Paginations";

describe("PaginationWrapper: class that wrapps pagination functionality.", () => {
    test("should correctly set pagination life time if it meets the conditions.", () => {
        const pagination = new PaginationWrapper();

        pagination.setTime(20 * 1000);

        expect(pagination.time).toBe(20 * 1000);

        expect(() => {
            pagination.setTime(500);
        }).toThrow();

        expect(() => {
            pagination.setTime(120 * 60 * 1000);
        }).toThrow();

        expect(() => {
            pagination.setTime(-500);
        }).toThrow();

        pagination.setTime(120 * 60 * 1000, true);

        expect(pagination.time).toBe(120 * 60 * 1000);
    });

    test("should correctly set afterSendingAction.", () => {
        const afterSendingAction = () => null;

        const pagination = new PaginationWrapper()
            .setAfterSendingAction(afterSendingAction);

        expect(pagination.afterSendingAction).toStrictEqual(afterSendingAction);
    });

    test("should correctly set beforeStopAction.", () => {
        const beforeStopAction = () => null;

        const pagination = new PaginationWrapper()
            .setBeforeStopAction(beforeStopAction);

        expect(pagination.beforeStopAction).toStrictEqual(beforeStopAction);
    });

    test("should correctly set afterStopAction.", () => {
        const afterStopAction = () => null;

        const pagination = new PaginationWrapper()
            .setAfterStopAction(afterStopAction);

        expect(pagination.afterStopAction).toStrictEqual(afterStopAction);
    });

    test("should correctly find button by customId.", () => {
        const button = new ButtonWrapper()
            .setAction(() => false)
            .setData({custom_id: "custom_Id"})
            .setSwitch(() => false);

        const pagination = new PaginationWrapper()
            .setButtons(button);

        expect(pagination.getButtonByCustomId("custom_Id")).toStrictEqual(button);
        expect(pagination.getButtonByCustomId("incorrect_Id")).toBeUndefined();
    });

    test("should correctly set embeds if they meet conditions.", () => {
        const embeds =
        [
            new EmbedBuilder()
                .setDescription("Totally normal description."),
            new EmbedBuilder(),
        ];

        const pagination = new PaginationWrapper();

        expect(() => {
            pagination.setEmbeds(embeds);
        }).toThrow();

        embeds[1]
            .setDescription(new Array(4096 + 1).join("A"))
            .setTitle(new Array(256 + 1).join("A"))
            .setFields(
                {
                    name: new Array(128 + 1).join("A"),
                    value: new Array(1024 + 1).join("A"),
                },
                {
                    name: new Array(128 + 1).join("A"),
                    value: new Array(1024 + 1).join("A"),
                },
            );

        expect(() => {
            pagination.setEmbeds(embeds);
        }).toThrow();

        expect(pagination.setEmbeds([embeds[0]]).embeds).toStrictEqual([embeds[0].data]);
    });

    test("should correctly set buttons if they meet the conditions.", () =>
    {
        const buttons = new Array(Constants.DiscordMaxButtonsPerRow * Constants.DiscordMaxRowsPerMessage + 1).fill(new ButtonWrapper());

        const pagination = new PaginationWrapper();

        expect(() => {
            pagination.setButtons(buttons);
        }).toThrow(`[DJS-Button-Pages]: There can not be more than ${Constants.DiscordMaxButtonsPerRow * Constants.DiscordMaxRowsPerMessage}.`);

        const button = new ButtonWrapper();

        expect(() => {
            pagination.setButtons(button);
        }).toThrow();

        const buttons2 = new Array(2).fill(
            new ButtonWrapper()
                .setData({custom_id: "custom_Id"})
                .setAction(() => false)
                .setSwitch(() => false)
        );

        expect(() => {
            pagination.setButtons(buttons2);
        }).toThrow();

        const normalButton = new ButtonWrapper()
            .setData({custom_id: "custom_Id"})
            .setAction(() => false)
            .setSwitch(() => false)

        expect(pagination.setButtons(normalButton).buttons).toStrictEqual([normalButton]);
    });

    test("should correctly set filterOptions if they meet the conditions.", () => {
        const pagination = new PaginationWrapper();
        const exampleOptions = {removeButtonsOnEnd: true};

        expect(pagination.setFilterOptions(exampleOptions).filterOptions).toStrictEqual(exampleOptions);

        expect(() => {
            pagination.setFilterOptions({maxIdleTime: -1});
        }).toThrow();

        expect(() => {
            pagination.setFilterOptions({maxIdleTime: 2.5});
        }).toThrow();

        expect(() => {
            pagination.setFilterOptions({maxInteractions: -1});
        }).toThrow();

        expect(() => {
            pagination.setFilterOptions({maxInteractions: 2.5});
        }).toThrow();

        expect(() => {
            pagination.setFilterOptions({maxUsers: -1});
        }).toThrow();

        expect(() => {
            pagination.setFilterOptions({maxUsers: 2.5});
        }).toThrow();

        expect(() => {
            pagination.setFilterOptions({noAccessReplyContent: ""});
        }).toThrow();
    });

    test("should correctly set allowed users.", () => {
        const allowedUsers = ["497808224817381377"];

        const pagination = new PaginationWrapper();

        expect(pagination.setAllowedUsers(allowedUsers).filterOptions.allowedUsers).toStrictEqual(allowedUsers);
    });

    test("should correctly add allowed users.", () => {
        const allowedUser = "497808224817381377";

        const pagination = new PaginationWrapper();

        expect(pagination.addAllowedUsers(allowedUser).filterOptions.allowedUsers).toStrictEqual([allowedUser]);
    });

    test("should correctly re-create from another instance of class.", () => {
        const previousPagination = {
            embeds: 
            [
                new EmbedBuilder()
                    .setDescription("Description.")
                    .data,
                new EmbedBuilder()
                    .setDescription("Description.")
                    .data
            ],
            time: 10 * 1000,
            filterOptions: {},
            buttons:
            [
                new ButtonWrapper({custom_id: "customId"})
                    .setAction(() => false)
                    .setSwitch(() => false)
            ],
        };

        const pagination = new PaginationWrapper(previousPagination);

        expect(pagination.toJSON()).toStrictEqual(previousPagination);
    });
});