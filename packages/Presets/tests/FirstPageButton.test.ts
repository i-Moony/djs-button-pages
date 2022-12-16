import { ButtonInteraction } from "discord.js";
import { PaginationSent } from "djs-button-pages";
import { FirstPageButton } from "../src/Presets";

describe("FirstPageButton: button that switches pagination to the first page.", () => {
    test("action should switch pagination's page and call an update method.", async () => {
        const switchPageMock = jest.fn(),
        updateMock = jest.fn(),
        pagesMock = ({
            update: updateMock,
            setPage:switchPageMock
        } as unknown) as PaginationSent,
        interactionMock = ({} as unknown) as ButtonInteraction;

        const button = new FirstPageButton();

        await button.action(pagesMock, interactionMock);
        
        expect(switchPageMock).toHaveBeenCalledWith(0);
        expect(updateMock).toHaveBeenCalled();
    });

    test("switch should be disabled only when pagination is set to the first page.", async () => {
        const pagesMock1 = ({
            page: 1
        } as unknown) as PaginationSent;
        
        const button = new FirstPageButton();

        expect(await button.switch(pagesMock1)).toBeFalsy();

        const pagesMock2 = ({
            page: 0
        } as unknown) as PaginationSent;

        expect(await button.switch(pagesMock2)).toBeTruthy();
    });
});