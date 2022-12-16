import { APIEmbed } from "discord.js";
import ButtonWrapper from "./ButtonWrapper";
import FilterOptions from "./FilterOptions";

/**
 * Interface for pagination's data.
 */
export default interface PaginationData
{
    /**
     * Options for filtering out interactions.
     */
    filterOptions: FilterOptions,
    /**
     * Pages.
     */
    embeds: Array<APIEmbed>,
    /**
     * Buttons.
     */
    buttons: Array<ButtonWrapper>,
    /**
     * Life-time.
     */
    time: number,
};