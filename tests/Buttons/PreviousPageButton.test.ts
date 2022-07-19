import PreviousPageButton from "../../src/Classes/Buttons/PreviousPageButton";
import PaginationData from "../../src/Classes/Paginations/Basic/PaginationData";

describe("Button that switches pagination to the previous page", () => {
    test("should initialize with action and disableWhen that equals to zero.", async () => {
        const button = new PreviousPageButton();

        expect(button.disableWhen).toBe(0);

        const dataMock: PaginationData = ({
            currentPage: 5,
        } as unknown) as PaginationData;

        if (!(button.action instanceof Function))
            throw new Error("Action should be a function!");

        const result = await button.action(dataMock);

        expect(result).toBe(dataMock.currentPage - 1);
    });
});