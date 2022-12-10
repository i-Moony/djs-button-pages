import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { PaginationSent } from "djs-button-pages";
import { NextPageButton } from "../src/Presets";

describe("NextPageButton: button that switches pagination to the next page.", () => {
    test("action should switch pagination's page and call an update method.", async () => {
        const switchPageMock = jest.fn(),
        updateMock = jest.fn(),
        pagesMock = ({
            update: updateMock,
            setPage:switchPageMock,
            page: 1,
        } as unknown) as PaginationSent,
        interactionMock = ({} as unknown) as ButtonInteraction;

        const button = new NextPageButton();

        await button.action(pagesMock, interactionMock);
        
        expect(switchPageMock).toHaveBeenCalledWith(2);
        expect(updateMock).toHaveBeenCalled();
    });

    test("switch should be disabled only when pagination is set to the last page.", async () => {
        const pagesMock1 = ({
            page: 2,
            data:
            {
                embeds:
                [
                    new EmbedBuilder(),
                    new EmbedBuilder(),
                    new EmbedBuilder(),
                    new EmbedBuilder()
                ]
            }} as unknown) as PaginationSent;
        
        const button = new NextPageButton();

        expect(await button.switch(pagesMock1)).toBeFalsy();

        const pagesMock2 = ({
            page: 1,
            data: 
            {
                embeds:
                [
                    new EmbedBuilder(), 
                    new EmbedBuilder()
                ]
            }} as unknown) as PaginationSent;

        expect(await button.switch(pagesMock2)).toBeTruthy();
    });
});