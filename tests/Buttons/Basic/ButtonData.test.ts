import { MessageButton } from "discord.js";
import ButtonData from "../../../src/Classes/Buttons/Basic/ButtonData";

describe("Button data", () => {
    test("should initialize with a null style, null action and null disableWhen.", () => {
        const button = new ButtonData();

        expect(button.style).toBeNull();
        expect(button.action).toBeNull();
        expect(button.disableWhen).toBeNull();
    });

    test("should initialize with a given style.", () => {
        const style = new MessageButton().setCustomId("testid").setLabel("button").setStyle("PRIMARY");

        expect(new ButtonData(style).style).toBe(style);

        const buttonStyle = new ButtonData().setStyle(new MessageButton().setCustomId("testid").setLabel("button").setStyle("PRIMARY"));

        expect(new ButtonData(buttonStyle).style).toBe(buttonStyle.style);
    });

    test("setStyle should throw error if there are no customId.", () => {
        const incorrectStyle = new MessageButton().setLabel("button").setStyle("PRIMARY");
        
        expect(() => new ButtonData(incorrectStyle)).toThrow("Button should have customId, emoji or label and style.");
    });

    test("setStyle should throw error if there are no label or emoji.", () => {
        const incorrectStyle = new MessageButton().setCustomId("testid").setStyle("PRIMARY");

        expect(() => new ButtonData(incorrectStyle)).toThrow("Button should have customId, emoji or label and style.");
    });

    test("setStyle should throw error if there are no style.", () => {
        const incorrectStyle = new MessageButton().setCustomId("testid").setEmoji("▶");

        expect(() => new ButtonData(incorrectStyle)).toThrow("Button should have customId, emoji or label and style.");
    });

    test("setStyle should throw error if LINK style is passed.", () => {
        const incorrectStyle = new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("LINK");

        expect(() => new ButtonData(incorrectStyle)).toThrow("Button can't have link style, because component collector can't collect it's interaction.");
    });
});