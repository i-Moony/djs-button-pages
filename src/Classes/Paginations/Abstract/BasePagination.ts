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
    TextChannel,
    DMChannel,
    Interaction } from "discord.js";
import Constants from "../../../Constants";
import { PaginationData } from "./PaginationData";

abstract class BasePagination<T extends ReplyMessageOptions | MessageOptions | InteractionReplyOptions> extends PaginationData
{
    protected constructor()
    {
        super();
    };

    private _messageOptions:T;

    public abstract send(channel:TextChannel | DMChannel | Interaction | Message, user?:User): Promise<void>;

    public get messageOptions(): T
    {
        return this._messageOptions ?? null;
    };

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

    protected async _collected(interaction:ButtonInteraction): Promise<void>
    {
        if (!this.embeds || !this.collector)
            throw new Error("This function may be triggered only if the pagination is already sent!");

        const nextPage = await this._getPage(interaction.customId);

        if (!nextPage && nextPage !== 0)
            throw new TypeError("Page for this button is not defined!");
        
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

    private async _getPage(customId: string): Promise<number>
    {
        const fullButton = this.getButtonByCustomId(customId);

        if (!fullButton)
            throw new Error("No buttons for this customId!");

        if (!fullButton.action && fullButton.action !== 0)
            throw new Error("This button doesn't have an action.");

        return fullButton.action instanceof Function ? fullButton.action(this) : fullButton.action;
    };

    protected async _getActionRows(nextPage:number): Promise<Array<MessageActionRow<MessageButton>>>
    {
        const actionRows = this._buildActionRows();

        for (const row of actionRows)
            for (const button of row.components)
                await this._disableButton(button, nextPage);

        return actionRows;
    };

    private async _disableButton(button:MessageButton, nextPage:number): Promise<void>
    {
        if (!button.customId)
            throw new Error("Button should have customId!");

        const fullButton = this.getButtonByCustomId(button.customId);

        if (!fullButton)
            throw new Error("No buttons for this customId!");

        if (!fullButton.disableWhen && fullButton.disableWhen !== 0)
            return;

        const disableWhen = fullButton.disableWhen instanceof Function ? await fullButton.disableWhen(this, nextPage) : fullButton.disableWhen;

        if (disableWhen === nextPage)
            button.setDisabled(true);

        return;
    };

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

    protected _formFilter(message:Message, user?: User)
    {
        return async (interaction:ButtonInteraction) => 
        {
            if (interaction.message.id !== message.id)
                return false;

            if (this.filterOptions.onlyAuthor && user && interaction.user.id !== user.id)
            {
                await interaction.reply({content: this.filterOptions?.notAuthorReply ?? "These buttons are not for you!", ephemeral: true});

                return false;
            }
            else
            {
                await interaction.deferUpdate();
            };

            return true;
        };
    };
};

export { BasePagination };