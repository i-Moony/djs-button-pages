import { ButtonData,
    ButtonWrapper, 
    PaginationSent } from "djs-button-pages";

/**
 * Bind for button that deletes pagination.
 */
export default class DeleteButton extends ButtonWrapper
{
    /**
     * Bind for button that delets pagination.
     * @param {ButtonData} style Styling for button.
     */
    public constructor(style:ButtonData)
    {
        super(style);

        this.setAction(DeleteButton._doAction);
        this.setSwitch(DeleteButton._switch);
    };

    /**
     * Action that deletes pagination.
     * @param {PaginationSent} pagination Pagination.
     * @returns {Promise<void>}
     */
    private static async _doAction(pagination:PaginationSent): Promise<void>
    {
        return pagination.delete();
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