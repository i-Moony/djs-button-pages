import { MessageEmbed } from "discord.js";
import LastPageButton from "../../src/Classes/Buttons/LastPageButton";
import PaginationData from "../../src/Classes/Paginations/Basic/PaginationData";

describe("Button that switches pagination to the last page", () => {
    test("should initialize with action and disableWhen.", async () => {
        const button = new LastPageButton();

        expect(button.action).toBeInstanceOf(Function);
        expect(button.action).toBe(button.disableWhen);
        
        const dataMock: PaginationData = ({
            embeds: [new MessageEmbed().setDescription("1")],
        } as unknown) as PaginationData;

        if(!dataMock.embeds)
            throw new Error("No embeds!");

        if (!(button.action instanceof Function))
            throw new Error("Action should be a function!");

        const result = await button.action(dataMock);

        expect(result).toBe(dataMock.embeds.length - 1);
    });

    test("should throw error if no embeds supplied!", async () => {
        const button = new LastPageButton();

        const dataMock: PaginationData = ({} as unknown) as PaginationData;

        expect(async () => {
            if (!(button.action instanceof Function))
                throw new Error("Action should be a function!");

            await button.action(dataMock);
        }).rejects.toThrow("Last page button can't be used before embeds are supplied to the pagination.");
    });
});