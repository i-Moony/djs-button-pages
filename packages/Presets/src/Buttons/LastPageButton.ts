import { ButtonData,
    ButtonWrapper, 
    PaginationSent } from "djs-button-pages";

/**
 * Bind for button that switches pagination to the last page.
 */
export default class LastPageButton extends ButtonWrapper
{
    /**
     * Bind for button that switches pagination to the last page.
     * @param {ButtonData} style Styling for button.
     */
    public constructor(style?:ButtonData)
    {
        super(style);

        this.setAction(LastPageButton._doAction);
        this.setSwitch(LastPageButton._switch);
    };

    /**
     * Action that switches pagination to the last page.
     * @param {PaginationSent} pagination Pagination.
     * @returns {Promise<void>}
     */
    private static async _doAction(pagination:PaginationSent): Promise<void>
    {
        pagination.setPage(pagination.data.embeds.length - 1);
        return pagination.update();
    };

    /**
     * Switch that disables button on the last page.
     * @param {PaginationSent} pagination Pagination.
     * @returns {boolean} Button's state.
     */
    private static _switch(pagination:PaginationSent): boolean
    {
        if (pagination.page === pagination.data.embeds.length - 1)
            return true;
        
        return false;
    };
};