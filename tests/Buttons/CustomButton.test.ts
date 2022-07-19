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
        const style = new MessageButton().setCustomId("testid").setLabel("button").setStyle("PRIMARY");

        expect(new CustomButton(style).style).toBe(style);

        const buttonStyle = new CustomButton().setStyle(new MessageButton().setCustomId("testid").setLabel("button").setStyle("PRIMARY")).setAction(1).setDisableWhen(1),
        button = new CustomButton(buttonStyle);

        expect(button.style).toBe(buttonStyle.style);
        expect(button.action).toBe(buttonStyle.action);
        expect(button.disableWhen).toBe(buttonStyle.disableWhen);
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

    test("setDisableWhen should throw error if negative number, except minus one, is passed.", () => {
        const button = new CustomButton();

        expect(() => button.setDisableWhen(-2)).toThrow("DisableWhen should return natural number or minus one to be always turned on.");

        expect(button.setDisableWhen(-1).disableWhen).toBe(-1);
    });
});