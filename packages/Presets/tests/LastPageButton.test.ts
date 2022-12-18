import { ButtonInteraction, MessageEmbed } from "discord.js";
import { PaginationSent } from "djs-button-pages";
import { LastPageButton } from "../src/Presets";

describe("LastPageButton: button that switches pagination to the last page.", () => {
    test("action should switch pagination's page and call an update method.", async () => {
        const switchPageMock = jest.fn(),
        updateMock = jest.fn(),
        pagesMock = ({
            update: updateMock,
            setPage:switchPageMock,
            data:
            {
                embeds: 
                [
                    new MessageEmbed(),
                    new MessageEmbed()
                ]
            }} as unknown) as PaginationSent,
        interactionMock = ({} as unknown) as ButtonInteraction;

        const button = new LastPageButton();

        await button.action(pagesMock, interactionMock);
        
        expect(switchPageMock).toHaveBeenCalledWith(1);
        expect(updateMock).toHaveBeenCalled();
    });

    test("switch should be disabled only when pagination is set to the last page.", async () => {
        const pagesMock1 = ({
            page: 2,
            data:
            {
                embeds:
                [
                    new MessageEmbed(),
                    new MessageEmbed(),
                    new MessageEmbed(),
                    new MessageEmbed()
                ]
            }} as unknown) as PaginationSent;
        
        const button = new LastPageButton();

        expect(await button.switch(pagesMock1)).toBeFalsy();

        const pagesMock2 = ({
            page: 1,
            data: 
            {
                embeds:
                [
                    new MessageEmbed(), 
                    new MessageEmbed()
                ]
            }} as unknown) as PaginationSent;

        expect(await button.switch(pagesMock2)).toBeTruthy();
    });
});