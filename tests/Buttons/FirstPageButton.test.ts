import FirstPageButton from "../../src/Classes/Buttons/FirstPageButton";

describe("Button that switches pagination to the first page", () => {
    test("should initialize with action that equals to zero and disableWhen that equals to zero.", () => {
        const button = new FirstPageButton();
        
        expect(button.action).toBe(0);
        expect(button.disableWhen).toBe(0);
    });
});