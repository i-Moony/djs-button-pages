import { ButtonInteraction } from "discord.js";
import { PaginationSent } from "djs-button-pages";
import { StopButton } from "../src/Presets";

describe("StopButton: button that stops pagination.", () => {
    test("action should call pagination's stop method.", async () => {
        const methodMock = jest.fn(),
        pagesMock = ({
            stop: methodMock,
        } as unknown) as PaginationSent,
        interactionMock = ({} as unknown) as ButtonInteraction;

        const button = new StopButton();

        await button.action(pagesMock, interactionMock);
        
        expect(methodMock).toHaveBeenCalled();
    });

    test("switch should always return false.", async () => {
        const pagesMock = ({} as unknown) as PaginationSent;
        
        const button = new StopButton();

        expect(await button.switch(pagesMock)).toBeFalsy();
    });
});