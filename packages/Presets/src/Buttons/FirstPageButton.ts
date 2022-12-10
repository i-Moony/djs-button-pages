import { ButtonData,
    ButtonWrapper, 
    PaginationSent } from "djs-button-pages";

/**
 * Bind for button that switches pagination to the first page.
 */
export default class FirstPageButton extends ButtonWrapper
{
    /**
     * Bind for button that switches pagination to the first page.
     * @param {ButtonData} style Styling for button.
     */
    public constructor(style?:ButtonData)
    {
        super(style);

        this.setAction(FirstPageButton._doAction);
        this.setSwitch(FirstPageButton._switch);
    };

    /**
     * Action that switches pagination to the first page.
     * @param {PaginationSent} pagination Pagination.
     * @returns {Promise<void>}
     */
    private static async _doAction(pagination:PaginationSent): Promise<void>
    {
        pagination.setPage(0);
        return pagination.update();
    };

    /**
     * Switch that disables button on the first page.
     * @param {PaginationSent} pagination Pagination.
     * @returns {boolean} Button's state.
     */
    private static _switch(pagination:PaginationSent): boolean
    {
        if (pagination.page === 0)
            return true;
        
        return false;
    };
};