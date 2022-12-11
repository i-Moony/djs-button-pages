import { EmbedBuilder,
    Message } from "discord.js";
import { ButtonWrapper,
    PaginationSent, 
    PaginationState } from "../../src/Paginations";

describe("PaginationSent: class that manages pagination after it was sent.", () => {
    test("should correctly set initial data.", () => {
        const data =
        {
            embeds:
            [
                new EmbedBuilder()
                    .data
            ],
            time: 500,
            filterOptions: {},
            buttons:
            [
                new ButtonWrapper()
            ],
        },
        message = ({} as unknown) as Message,
        pageNumber = 2;

        const pagination = new PaginationSent(data, message, pageNumber);

        expect(pagination.data).toStrictEqual(data);
        expect(pagination.attachedTo).toStrictEqual(message);
        expect(pagination.page).toBe(pageNumber);
        expect(pagination.state).toBe(PaginationState.NotReady);
        expect(pagination.isActive).toBeFalsy();
    });

    test("should correctly find button by customId.", () => {
        const button = new ButtonWrapper()
            .setData({custom_id: "custom_Id"}),
        data = 
        {
            embeds:
            [
                new EmbedBuilder()
                    .data
            ],
            time: 500,
            filterOptions: {},
            buttons:
            [
                button,
            ],
        },
        message = ({} as unknown) as Message;

        const pagination = new PaginationSent(data, message);

        expect(pagination.getButtonByCustomId("custom_Id")).toStrictEqual(button);
        expect(pagination.getButtonByCustomId("incorrect_Id")).toBeUndefined();
    });

    test("should correctly initialize.", () => {
        
    });
});