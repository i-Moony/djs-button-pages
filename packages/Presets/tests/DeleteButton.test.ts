import { ButtonInteraction } from "discord.js";
import { PaginationSent } from "djs-button-pages";
import { DeleteButton } from "../src/Presets";

describe("DeleteButton: button that deletes pagination.", () => {
    test("action should call pagination's delete method.", async () => {
        const methodMock = jest.fn(),
        pagesMock = ({
            delete: methodMock,
        } as unknown) as PaginationSent,
        interactionMock = ({} as unknown) as ButtonInteraction;

        const button = new DeleteButton();

        await button.action(pagesMock, interactionMock);
        
        expect(methodMock).toHaveBeenCalled();
    });

    test("switch should always return false.", async () => {
        const pagesMock = ({} as unknown) as PaginationSent;
        
        const button = new DeleteButton();

        expect(await button.switch(pagesMock)).toBeFalsy();
    });
});