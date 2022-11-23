import { ButtonData,
    ButtonWrapper, 
    PaginationSent } from "djs-button-pages";

/**
 * Bind for button that stops pagination.
 */
export default class StopButton extends ButtonWrapper
{
    /**
     * Bind for button that stop pagination.
     * @param {ButtonData} style Styling for button.
     */
    public constructor(style:ButtonData)
    {
        super(style);

        this.setAction(StopButton._doAction);
        this.setSwitch(StopButton._switch);
    };

    /**
     * Action that stops pagination.
     * @param {PaginationSent} pagination Pagination.
     * @returns {Promise<void>}
     */
    private static async _doAction(pagination:PaginationSent): Promise<void>
    {
        return pagination.stop();
    };

    /**
     * Switch that never disables the button.
     * @returns {false}
     */
    private static _switch(): false
    {
        return false;
    };
};