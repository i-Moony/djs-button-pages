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
    ActionRowBuilder,
    ButtonBuilder,
    ReplyMessageOptions,
    MessageOptions,
    User,
    InteractionReplyOptions,
    InteractionCollector,
    Interaction,
    ComponentType,
    APIButtonComponentWithCustomId} from "discord.js";
import Constants from "../../../Constants";
import PaginationData from "./PaginationData";

/**
 * Base pagination class that works with collector and it's events.
 * @template {ReplyMessageOptions | MessageOptions | InteractionReplyOptions} T
 */
abstract class BasePagination<T extends ReplyMessageOptions | MessageOptions | InteractionReplyOptions> extends PaginationData
{
    /**
     * Base pagination class that works with collector and it's events.
     * @param {PaginationData} data Data from which to build BasePagination.
     */
    protected constructor(data?:PaginationData)
    {
        super(data);

        if (data instanceof BasePagination<T>)
            this._setupData(data);

        return;
    };

    private _messageOptions:T;

    public abstract send(sendTo:unknown, user?:User): Promise<void>;

    /**
     * Options for sending out message.
     * @type {T | null}
     */
    public get messageOptions(): T | null
    {
        return this._messageOptions ?? null;
    };

    /**
     * Sets options for sending out message.
     * @param {T} options Options for sending out message.
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
        if (!this.embeds || !this.collector) /* istanbul ignore next */ 
            throw new Error("This method may be triggered only if the pagination is already sent!");

        const nextPage = await this._getPageNumber(interaction.customId);
        
        if (!interaction.deferred)
            await interaction.deferUpdate();

        if (nextPage === -1)
            return this.collector.stop();

        const embed = this.embeds[nextPage];

        if (!embed)
            throw new TypeError("Page for this button is not defined!");

        const actionRows = await this._getActionRowsByPage(nextPage);

        this._setCurrentPage(nextPage);

        await interaction.editReply({embeds: [embed], components: actionRows});

        if (this.filterOptions?.resetTimer)
            this.collector.resetTimer();

        return;
    };

    /**
     * Method that handles `stop` event.
     * @param {string} reason Reason of collector's stop event.
     * @param {Message | Interaction} message Message that was sent or Interaction that was replied.
     * @returns {Promise<void>} Updates pagination.
     */
    protected async _stop(reason:string, message:Message | Interaction): Promise<void>
    {
        const actionRows = this._buildActionRows(true);

        if (message instanceof Message && message.editable)
        {
            await message.edit({components: this.filterOptions?.removeButtonsOnEnd ? [] : actionRows});
        }
        else if (!(message instanceof Message) && message.isRepliable())
        {
            await message.editReply({components: this.filterOptions?.removeButtonsOnEnd ? [] : actionRows});
        };

        if (this.onStop)
            await this.onStop(reason);

        return;
    };

    /**
     * Gets actionRows with buttons for specific page.
     * @param {number} page Page number.
     * @returns {Promise<Array<ActionRowBuilder<ButtonBuilder>>>} ActionRows.
     */
    protected async _getActionRowsByPage(page:number): Promise<Array<ActionRowBuilder<ButtonBuilder>>>
    {
        if (!this.buttons)
            throw new Error("Buttons should be defined!");

        const rows = this._buildActionRows();

        let buttonNumber = 0;

        for (const row of rows)
        {
            for (const button of row.components)
            {
                const fullButton = this.buttons[buttonNumber];

                if (!fullButton || !fullButton.style)
                    throw new Error("Button should be defined!");

                await this._disableButton(fullButton.style, button, page);

                buttonNumber++;
            };
        };

        return rows;
    };

    /**
     * Disables or enables button.
     * @param {APIButtonComponentWithCustomId} buttonData Raw button data.
     * @param {ButtonBuilder} buttonBuilder Button builder.
     * @param {number} page Page number.
     * @returns {Promise<void>}
     */
    private async _disableButton(buttonData:APIButtonComponentWithCustomId, buttonBuilder:ButtonBuilder, page:number): Promise<void>
    {
        const fullButton = this.getButtonByCustomId(buttonData.custom_id);

        if (!fullButton) /* istanbul ignore next */ 
            throw new Error("No buttons for this customId!");

        if (!fullButton.disableWhen && fullButton.disableWhen !== 0) /* istanbul ignore next */ 
            return;

        const disableWhen = fullButton.disableWhen instanceof Function ? await fullButton.disableWhen(this, page) : fullButton.disableWhen;

        buttonBuilder.setDisabled(disableWhen === page);

        return;
    };

    /**
     * Builds action rows with buttons.
     * @param {boolean} disabled Buttons should be disabled or not.
     * @returns {Array<ActionRowBuilder<ButtonBuilder>>} ActionRows.
     */
    private _buildActionRows(disabled = false): Array<ActionRowBuilder<ButtonBuilder>>
    {
        const rows:Array<ActionRowBuilder<ButtonBuilder>> = [];

        for (let i = 0; i < Constants.DISCORD_MAX_ROWS_PER_MESSAGE - 1; i++)
        {
            rows.push(new ActionRowBuilder());

            this.buttons?.slice(i*Constants.DISCORD_MAX_BUTTONS_PER_ROW, (i+1)*Constants.DISCORD_MAX_BUTTONS_PER_ROW).forEach((button) =>
            {
                if (button.style)
                    rows[i].addComponents(new ButtonBuilder(button.style).setDisabled(disabled));
            });
        };

        rows.forEach((row) =>
        {
            if (row.components.length === 0)
                rows.splice(rows.indexOf(row));
        });

        return rows;
    };

    /**
     * Forms collector.
     * @param {Message} message Message that collector should stick to.
     * @param {User} user Used only if {@link singleUserAccess} is true. Needed only if only one user should be able to use pagination.
     * @returns {InteractionCollector<ButtonInteraction>} Interaction Collector.
     */
    protected _formCollector(message:Message, user?:User): InteractionCollector<ButtonInteraction>
    {
        if (!this.time) /* istanbul ignore next */ 
            throw new Error("This method can be used only if time is already defined!");

        return message.createMessageComponentCollector({
            time: this.time,
            componentType: ComponentType.Button,
            maxUsers: this.collectorOptions?.maxUsers,
            max: this.collectorOptions?.maxInteractions,
            idle: this.collectorOptions?.maxIdleTime,
            filter: this._formFilter(message, user),
        });
    };

    /**
     * Forms filter for InteractionCollector.
     * @param {Message} message Message that collector should stick to.
     * @param {User} user Needed only if one user should be able to use pagination and filterOptions onlyOneUser is true.
     * @returns {(interaction:ButtonInteraction) => Promise<boolean>} Function that filters out interactions.
     */
    private _formFilter(message:Message, user?: User): (interaction:ButtonInteraction) => Promise<boolean>
    {
        return async (interaction:ButtonInteraction) => 
        {
            if (interaction.message.id !== message.id)
                return false;

            if (this.filterOptions?.singleUserAccess && user && interaction.user.id !== user.id)
            {
                if (this.filterOptions?.noAccessReply && this.filterOptions?.noAccessReplyContent)
                    await interaction.reply(typeof this.filterOptions.noAccessReplyContent === "object" ? this.filterOptions.noAccessReplyContent : {content: this.filterOptions?.noAccessReplyContent, ephemeral: true});

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
     * Gets page number from customId of button that was pressed.
     * @param {string} customId CustomId of button that was pressed.
     * @returns {Promise<number>} Number of page.
     */
    private async _getPageNumber(customId: string): Promise<number>
    {
        const fullButton = this.getButtonByCustomId(customId);

        if (!fullButton) /* istanbul ignore next */ 
            throw new Error("No buttons for this customId!");

        if (!fullButton.action && fullButton.action !== 0) /* istanbul ignore next */ 
            throw new Error("This button doesn't have an action.");

        return fullButton.action instanceof Function ? fullButton.action(this) : fullButton.action;
    };

    /**
     * Setups data from another base pagination.
     * @param {BasePagination<T>} data BasePagination.
     * @returns {void}
     */
    private _setupData(data:BasePagination<T>): void
    {
        if (data.messageOptions)
            this._messageOptions = data.messageOptions;

        return;
    };
};

export default BasePagination;