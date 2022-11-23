import { InteractionReplyOptions,
    Snowflake } from "discord.js";

/**
 * Options for filtering out interactions.
 */
export default interface FilterOptions
{
    /**
     * Defines whether to filter out by user's id or not.
     */
    filterUsers?: boolean,
    /**
     * Defines an array of users that can use pages.
     */
    allowedUsers?: Array<Snowflake>

    /**
     * Defines whether to reply to those who have no access to pages or not.
     */
    noAccessReply?: boolean,
    /**
     * Defines a reply to those who have no access to pages.
     */
    noAccessReplyContent?: string | InteractionReplyOptions,
    /**
     * Defines whether to reset timer after page's update or not.
     */
    resetTimer?: boolean,
    /**
     * Defines whether to remove buttons after end or to disable them.
     */
    removeButtonsOnEnd?: boolean,

    /**
     * Defines max interactions number.
     */
    maxInteractions?: number,
    /**
     * Defines max users number that can interact with pages.
     */
    maxUsers?: number,
    /**
     * Defines max idle time for pages.
     */
    maxIdleTime?: number,
};