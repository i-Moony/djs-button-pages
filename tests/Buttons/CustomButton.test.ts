import { MessageButton } from "discord.js";
import CustomButton from "../../src/Classes/Buttons/CustomButton";

describe("Button that has custom scripts", () => {
    test("should initialize with a null style, null action and null disableWhen.", () => {
        const button = new CustomButton();

        expect(button.style).toBeNull();
        expect(button.action).toBeNull();
        expect(button.disableWhen).toBeNull();
    });

    test("should initialize with a given style.", () => {
        const style = new MessageButton().setCustomId("testid").setLabel("button").setStyle("PRIMARY"),
        button = new CustomButton(style);

        expect(button.style).toBe(style);
    });

    test("setStyle should throw error if there are no customId.", () => {
        const incorrectStyle = new MessageButton().setLabel("button").setStyle("PRIMARY");
        
        expect(() => new CustomButton(incorrectStyle)).toThrow("Button should have customId, emoji or label and style.");
    });

    test("setStyle should throw error if there are no label or emoji.", () => {
        const incorrectStyle = new MessageButton().setCustomId("testid").setStyle("PRIMARY");

        expect(() => new CustomButton(incorrectStyle)).toThrow("Button should have customId, emoji or label and style.");
    });

    test("setStyle should throw error if there are no style.", () => {
        const incorrectStyle = new MessageButton().setCustomId("testid").setEmoji("▶");

        expect(() => new CustomButton(incorrectStyle)).toThrow("Button should have customId, emoji or label and style.");
    });

    test("setStyle should throw error if LINK style is passed.", () => {
        const incorrectStyle = new MessageButton().setCustomId("testid").setEmoji("▶").setStyle("LINK");

        expect(() => new CustomButton(incorrectStyle)).toThrow("Button can't have link style, because component collector can't collect it's interaction.");
    });

    test("setAction should throw error if floating point number is passed.", () => {
        const button = new CustomButton();

        expect(() => button.setAction(2.5)).toThrow("Action should return natural number or minus one to stop pagination.");
    });

    test("setAction should throw error if negative number, except minus one, is passed.", () => {
        const button = new CustomButton();

        expect(() => button.setAction(-2)).toThrow("Action should return natural number or minus one to stop pagination.");

        expect(button.setAction(-1).action).toBe(-1);
    });

    test("setDisableWhen should throw error if floating point number is passed.", () => {
        const button = new CustomButton();

        expect(() => button.setDisableWhen(2.5)).toThrow("DisableWhen should return natural number or minus one to be always turned on.");
    });

    test("setAction should throw error if negative number, except minus one, is passed.", () => {
        const button = new CustomButton();

        expect(() => button.setDisableWhen(-2)).toThrow("DisableWhen should return natural number or minus one to be always turned on.");

        expect(button.setDisableWhen(-1).disableWhen).toBe(-1);
    });
});