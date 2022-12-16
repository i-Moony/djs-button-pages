import { ButtonData,
    ButtonWrapper, 
    PaginationSent } from "djs-button-pages";

/**
 * Bind for button that switches pagination to the next page.
 */
export default class NextPageButton extends ButtonWrapper
{
    /**
     * Bind for button that switches pagination to the next page.
     * @param {ButtonData} style Styling for button.
     */
    public constructor(style?:ButtonData)
    {
        super(style);

        this.setAction(NextPageButton._doAction);
        this.setSwitch(NextPageButton._switch);
    };

    /**
     * Action that switches pagination to the next page.
     * @param {PaginationSent} pagination Pagination.
     * @returns {Promise<void>}
     */
    private static async _doAction(pagination:PaginationSent): Promise<void>
    {
        pagination.setPage(pagination.page + 1);
        return pagination.update();
    };

    /**
     * Switch that disables button on the last page.
     * @param {PaginationSent} pagination Pagination.
     * @returns {boolean}
     */
    private static _switch(pagination:PaginationSent): boolean
    {
        if (pagination.page === pagination.data.embeds.length - 1)
            return true;
        
        return false;
    };
};