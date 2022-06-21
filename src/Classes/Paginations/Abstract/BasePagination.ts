/**
 * Copyright © 2022 Danila Kononov (nickname: moony). All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ButtonInteraction,
    Message,
    MessageActionRow,
    MessageButton,
    ReplyMessageOptions,
    MessageOptions,
    User,
    InteractionReplyOptions,
    Interaction } from "discord.js";
import Constants from "../../../Constants";
import PaginationData from "./PaginationData";

/**
 * Base pagination class that works with collector and it's events.
 */
abstract class BasePagination<T extends ReplyMessageOptions | MessageOptions | InteractionReplyOptions> extends PaginationData
{
    /**
     * Base pagination class that works with collector and it's events.
     */
    protected constructor()
    {
        super();
    };

    private _messageOptions:T;

    /**
     * Options for sending message.
     * @type {T}
     */
    public get messageOptions(): T
    {
        return this._messageOptions ?? null;
    };

    /**
     * Sets options for sending message.
     * @param {T} options Options for sending message.
     * @returns {this} Pagination.
     */
    public setMessageOptions(options:T): this
    {
        if (this.isActive)
            throw new Error("The pagination is already sent.");

        if (options.embeds)
            options.embeds = [];

        if (options.components)
            options.components = [];

        this._messageOptions = options;

        return this;
    };

    /**
     * Method that handles `collect` event.
     * @param {ButtonInteraction} interaction Interaction that the collector got.
     * @returns {Promise<void>} Updates pagination.
     */
    protected async _collected(interaction:ButtonInteraction): Promise<void>
    {
        if (!this.embeds || !this.collector)
            throw new Error("This method may be triggered only if the pagination is already sent!");

        const nextPage = await this._getPageNumber(interaction.customId);
        
        if (!interaction.deferred)
            await interaction.deferUpdate();

        if (nextPage === -1)
        {
            this.collector.stop();

            return;
        };

        const embed = this.embeds[nextPage];

        if (!embed)
            throw new TypeError("Page for this button is not defined!");

        const actionRows = await this._getActionRows(nextPage);

        this._setCurrentPage(nextPage);

        await interaction.editReply({embeds: [embed], components: actionRows});

        if (this.filterOptions?.resetTimer)
            this.collector.resetTimer();

        return;
    };

    /**
     * Method that handles `stop` event.
     * @param {Message | Interaction} message Message that was sent or Interaction that was replied.
     * @returns {Promise<void>} Updates pagination.
     */
    protected async _stop(message:Message | Interaction): Promise<void>
    {
        const actionRows = this._buildActionRows(true);

        if (message instanceof Message && message.editable)
        {
            await message.edit({components: this.filterOptions?.removeButtonsAfterEnd ? [] : actionRows});
        }
        else if (message instanceof Interaction && message.isRepliable())
        {
            await message.editReply({components: this.filterOptions?.removeButtonsAfterEnd ? [] : actionRows});
        };

        return;
    };

    /**
     * Forms filter for InteractionCollector.
     * @param {Message} message Message that collector should stick to.
     * @param {User} user Needed only if one user should be able to use pagination and filterOptions have only
     * @returns {(interaction:ButtonInteraction) => Promise<boolean>} Function that filters out interactions.
     */
    protected _formFilter(message:Message, user?: User): (interaction:ButtonInteraction) => Promise<boolean>
    {
        return async (interaction:ButtonInteraction) => 
        {
            if (interaction.message.id !== message.id)
                return false;

            if (this.filterOptions.onlyOneUser && user && interaction.user.id !== user.id)
            {
                await interaction.reply({content: this.filterOptions?.notThatUserReply ?? "These buttons are not for you!", ephemeral: true});

                return false;
            }
            else
            {
                await interaction.deferUpdate();
            };

            return true;
        };
    };

    /**
     * Gets array of action rows for the page with specified number.
     * @param {number} page Number of page.
     * @returns {Promise<Array<MessageActionRow<MessageButton>>>} Array of action rows.
     */
    protected async _getActionRows(page:number): Promise<Array<MessageActionRow<MessageButton>>>
    {
        const actionRows = this._buildActionRows();

        for (const row of actionRows)
            for (const button of row.components)
                await this._disableButton(button, page);

        return actionRows;
    };
    
    /**
     * Disables button if needed for the specified page.
     * @param {MessageButton} button Button style.
     * @param {number} page Page number.
     * @returns {Promise<void>} Updates button style.
     */
    private async _disableButton(button:MessageButton, page:number): Promise<void>
    {
        if (!button.customId)
            throw new Error("Button should have customId!");

        const fullButton = this.getButtonByCustomId(button.customId);

        if (!fullButton)
            throw new Error("No buttons for this customId!");

        if (!fullButton.disableWhen && fullButton.disableWhen !== 0)
            return;

        const disableWhen = fullButton.disableWhen instanceof Function ? await fullButton.disableWhen(this, page) : fullButton.disableWhen;

        if (disableWhen === page)
            button.setDisabled(true);

        return;
    };

    /**
     * Gets page number from customId of button that was pressed.
     * @param {string} customId CustomId of button that was pressed.
     * @returns {Promise<number>} Number of page.
     */
    private async _getPageNumber(customId: string): Promise<number>
    {
        const fullButton = this.getButtonByCustomId(customId);

        if (!fullButton)
            throw new Error("No buttons for this customId!");

        if (!fullButton.action && fullButton.action !== 0)
            throw new Error("This button doesn't have an action.");

        return fullButton.action instanceof Function ? fullButton.action(this) : fullButton.action;
    };

    /**
     * Builds array of action rows and disables or enables every button.
     * @param {boolean} disableButtons Disable or enable all buttons.
     * @returns {Array<MessageActionRow<MessageButton>>} Array of action rows.
     */
    private _buildActionRows(disableButtons:boolean = false): Array<MessageActionRow<MessageButton>>
    {
        const actionRows:Array<MessageActionRow<MessageButton>> = [];

        for (let i = 0; i < Constants.DISCORD_TOTAL_ROWS_PER_MESSAGE - 1; i++)
        {
            actionRows.push(new MessageActionRow());

            this.buttons?.slice(i*Constants.DISCORD_TOTAL_BUTTONS_PER_ROW, (i+1)*Constants.DISCORD_TOTAL_BUTTONS_PER_ROW).forEach((button) =>
            {
                if (button.style)
                    actionRows[i].addComponents(button.style.setDisabled(disableButtons));
            });
        };

        actionRows.forEach((row) =>
        {
            if (row.components.length === 0)
                actionRows.splice(actionRows.indexOf(row));
        });

        return actionRows;
    };
};

export default BasePagination;