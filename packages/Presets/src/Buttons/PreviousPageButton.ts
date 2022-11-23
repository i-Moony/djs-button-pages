import { ButtonData,
    ButtonWrapper, 
    PaginationSent } from "djs-button-pages";

/**
 * Bind for button that switches pagination to the previous page.
 */
export default class PreviousPageButton extends ButtonWrapper
{
    /**
     * Bind for button that switches pagination to the previous page.
     * @param {ButtonData} style Styling for button.
     */
    public constructor(style:ButtonData)
    {
        super(style);

        this.setAction(PreviousPageButton._doAction);
        this.setSwitch(PreviousPageButton._switch);
    };

    /**
     * Action that switches pagination to the previous page.
     * @param {PaginationSent} pagination Pagination.
     * @returns {Promise<void>}
     */
    private static async _doAction(pagination:PaginationSent): Promise<void>
    {
        pagination.setPage(pagination.page - 1);
        return pagination.update();
    };

    /**
     * Switch that disables button on the first page.
     * @param {PaginationSent} pagination Pagination.
     * @returns {boolean}
     */
    private static _switch(pagination:PaginationSent): boolean
    {
        if (pagination.page === 0)
            return true;
        
        return false;
    };
};