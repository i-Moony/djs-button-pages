import { MessageEmbed } from "discord.js";
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
    embeds: Array<MessageEmbed>,
    /**
     * Buttons.
     */
    buttons: Array<ButtonWrapper>,
    /**
     * Life-time.
     */
    time: number,
};