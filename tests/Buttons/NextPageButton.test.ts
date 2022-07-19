import { MessageEmbed } from "discord.js";
import NextPageButton from "../../src/Classes/Buttons/NextPageButton";
import PaginationData from "../../src/Classes/Paginations/Basic/PaginationData";

describe("Button that switches pagination to the next page", () => {
    test("should initialize with action and disableWhen.", async () => {
        const button = new NextPageButton();

        expect(button.action).toBeInstanceOf(Function);
        expect(button.disableWhen).toBeInstanceOf(Function);
        
        const dataMock: PaginationData = ({
            embeds: [new MessageEmbed().setDescription("1"), new MessageEmbed().setDescription("2")],
            currentPage: 0,
        } as unknown) as PaginationData;

        if(!dataMock.embeds)
            throw new Error("No embeds!");

        if (!(button.action instanceof Function))
            throw new Error("Action should be a function!");

        const result = await button.action(dataMock);

        expect(result).toBe(dataMock.currentPage + 1);

        if (!(button.disableWhen instanceof Function))
            throw new Error("DisableWhen should be a function!");

        const anotherResult = await button.disableWhen(dataMock, 1);

        expect(anotherResult).toBe(dataMock.embeds.length - 1);
    });

    test("should throw error if no embeds supplied.", async () => {
        const button = new NextPageButton();

        const dataMock: PaginationData = ({} as unknown) as PaginationData;

        await expect(async () => {
            if (!(button.disableWhen instanceof Function))
                throw new Error("Action should be a function!");

            await button.disableWhen(dataMock, -1);
        }).rejects.toThrow("Next page button can't be used before embeds are supplied to the pagination.");
    });
});