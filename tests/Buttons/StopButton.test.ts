import StopButton from "../../src/Classes/Buttons/StopButton";

describe("Button that stops pagination", () => {
    test("should initialize with action that equals to minus one and disableWhen that equals to minus one.", () => {
        const button = new StopButton();

        expect(button.action).toBe(-1);
        expect(button.disableWhen).toBe(-1);
    });
});