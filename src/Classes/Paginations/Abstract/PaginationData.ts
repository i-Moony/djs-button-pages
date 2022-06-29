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
    InteractionCollector,
    MessageEmbed } from "discord.js";
import Constants from "../../../Constants";
import FilterOptions from "../../../Interfaces/FilterOptions";
import ButtonData from "../../Buttons/Abstract/ButtonData";
import OnStop from "../../../Typings/OnStop";
import AfterSending from "../../../Typings/AfterSending";

/**
 * Class for storing and modifying pagination data.
 */
abstract class PaginationData
{
    private _filterOptions:FilterOptions = {singleUserAccess: true, noAccessReply: true, noAccessReplyContent: "You're disallowed to use this very pagination!"};
    private _collectorOptions:ColletorOptions;
    private _collector:InteractionCollector<ButtonInteraction>;
    private _afterSending:AfterSending;
    private _onStop:OnStop;

    /**
     * Indicates whether this pagination sent or not.
     * By default is false.
     * @type {boolean}
     */
    public get isActive(): boolean
    {
        return this._isActive;
    };

    /**
     * How long the pagination will exist (in milliseconds).
     * By default is zero.
     * @type {number | null}
     */
    public get time(): number | null
    {
        return this._time > 0 ? this._time : null;
    };
    
    /**
     * The buttons of this pagination.
     * By default is an empty array.
     * @type {Array<ButtonData> | null}
     */
    public get buttons(): Array<ButtonData> | null
    {
        return this._buttons && this._buttons.length !== 0 ? this._buttons : null;
    };

    /**
     * Embeds of this pagination.
     * By default is an empty array.
     * @type {Array<MessageEmbed> | null}
     */
    public get embeds(): Array<MessageEmbed> | null
    {
        return this._embeds && this._embeds.length !== 0 ? this._embeds : null;
    };

    /**
     * Current page number. Zero-based.
     * By default is zero.
     * @type {number}
     */
    public get currentPage(): number
    {
        return this._currentPage;
    };

    /**
     * Options for filtering button interactions.
     * By default {@link singleUserAccess} and {@link noAccessReply} are true. And {@link noAccessReplyContent} is "You're disallowed to use this very pagination!".
     * @type {FilterOptions}
     */
    public get filterOptions(): FilterOptions
    {
        return this._filterOptions;
    };

    /**
     * Options for collecting button interactions.
     * @type {ColletorOptions}
     */
    public get collectorOptions(): ColletorOptions
    {
        return this._collectorOptions;
    };

    /**
     * Collector that collects button interactions.
     * @type {InteractionCollector<ButtonInteraction> | null}
     */
    public get collector(): InteractionCollector<ButtonInteraction> | null
    {
        return this._collector ?? null;
    };

    /**
     * Action that will be completed after the pagination was sent.
     * @type {AfterSending | null}
     */
    public get afterSending(): AfterSending | null
    {
        return this._afterSending ?? null;
    };

    /**
     * Action that will be completed after the pagination was stopped.
     * @type {OnStop | null}
     */
    public get onStop(): OnStop | null
    {
        return this._onStop ?? null;
    };

    /**
     * Gets {@link ButtonData} by it's customId.
     * @param {string} customId Button's customId. Should be a string.
     * @returns {ButtonData | undefined} Button data.
     */
    public getButtonByCustomId(customId:string): ButtonData | undefined
    {
        return this.buttons?.find((but) => but.style?.customId === customId);
    };

    /**
     * Sets action that will be completed after the pagination was sent.
     * @param {AfterSending} action Action that will be completed.
     * @returns {this} Pagination.
     */
    public setAfterSendingAction(action:AfterSending): this
    {
        this._afterSending = action;

        return this;
    };

    /**
     * Sets action that will be completed after the pagination was stopped.
     * @param {OnStop} action Action that will be completed.
     * @returns {this} Pagination.
     */
    public setOnStopAction(action:OnStop): this
    {
        this._onStop = action;

        return this;
    };

    /**
     * Sets pagination active phase duration.
     * @param {number} time Time in milliseconds.
     * @param {boolean} bypassLibraryLimits Should the time bypass library limit or not.
     * @returns {this} Pagination.
     */
    public setTime(time:number, bypassLibraryLimits?:boolean): this
    {
        if (this._isActive)
            throw new Error("The pagination is already sent.");

        if (time < 0 || !Number.isInteger(time))
            throw new RangeError("Time should be natural.");

        if (time < Constants.LIBRARY_MIN_PAGES_LIFE_TIME)
            throw new RangeError("Pagination should exist at least one second.");

        if (!bypassLibraryLimits && time > Constants.LIBRARY_MAX_PAGES_LIFE_TIME)
            throw new RangeError(`Pagination total life time should be no more than an hour due to optimization. If you want to bypass the limit, pass true as the second argument to this method.`);

        this._time = time;

        return this;
    };

    /**
     * Inserts embeds.
     * @param {MessageEmbed | Array<MessageEmbed>} embeds Embed(-s) that is/are meant to be inserted.
     * @param {number} index Zero-based location in the array there the embed(-s) should be inserted.
     * @returns {this} Pagination.
     */
    public insertEmbeds(embeds:MessageEmbed | Array<MessageEmbed>, index:number): this
    {
        if (this._isActive)
            throw new Error("The pagination is already sent.");

        if (!Array.isArray(embeds))
            embeds = [embeds];

        if (embeds.some((embed) => !embed || !embed.length || embed.length < 1))
            throw new Error("No embeds from the array can be empty.");

        if (embeds.some((embed => embed.length > Constants.DISCORD_MAX_EMBED_LENGTH)))
            throw new RangeError(`No embeds from the array can be longer than ${Constants.DISCORD_MAX_EMBED_LENGTH}.`);

        if (index < 0 || !Number.isInteger(index))
            throw new RangeError("Index should be natural.");

        index || index === this._embeds?.length ? this._embeds.push(...embeds) : this._embeds.splice(index, 0, ...embeds);

        return this;
    };

    /**
     * Removes embed(-s) by it's/theirs index(-es) in the array of embeds.
     * @param {number} index Zero-based location in the array from which to start removing embeds.
     * @param {number} count Quantity of embeds to remove.
     * @returns {this} Pagination.
     */
    public removeEmbeds(index:number, count = 1): this
    {
        if (this._isActive)
            throw new Error("The pagination is already sent.");

        if (index < 0 || !Number.isInteger(index))
            throw new RangeError("Index should be natural.");

        if (count <= 0 || !Number.isInteger(count))
            throw new RangeError("Count should be natural and greater than zero.");

        this._embeds.splice(index, count);

        return this;
    };

    /**
     * Sets embed(-s). Overrides current embed(-s).
     * @param {MessageEmbed | Array<MessageEmbed>} embeds Embed(-s) that is/are meant to be set.
     * @returns {this} Pagination.
     */
    public setEmbeds(embeds:MessageEmbed | Array<MessageEmbed>): this
    {
        if (this._isActive)
            throw new Error("The pagination is already sent.");

        if (!Array.isArray(embeds))
            embeds = [embeds];

        if (embeds.some((embed) => !embed || !embed.length || embed.length < 1))
            throw new TypeError("No embeds from the array can be empty.");

        if (embeds.some((embed => embed.length > Constants.DISCORD_MAX_EMBED_LENGTH)))
            throw new RangeError(`No embeds from the array can be longer than ${Constants.DISCORD_MAX_EMBED_LENGTH}.`);

        this._embeds = embeds;

        return this;
    };

    /**
     * Sets button(-s). Overrides current button(-s).
     * @param {ButtonData | Array<ButtonData>} buttons Button(-s) that is/are meant to be set.
     * @returns {this} Pagination.
     */
    public setButtons(buttons:ButtonData | Array<ButtonData>): this
    {
        if (this._isActive)
            throw new Error("The pagination is already sent.");

        if (!Array.isArray(buttons))
            buttons = [buttons];

        if (buttons.length > Constants.DISCORD_MAX_BUTTONS_PER_ROW * Constants.DISCORD_MAX_ROWS_PER_MESSAGE)
            throw new RangeError(`There can not be more than ${Constants.DISCORD_MAX_BUTTONS_PER_ROW * Constants.DISCORD_MAX_ROWS_PER_MESSAGE} buttons per message because of Discord's limit.`);

        if (buttons.some((button) => !button))
            throw new TypeError("Buttons can not be empty.");

        if (buttons.some((button) => !button.style?.customId || (!button.style?.label && !button.style?.emoji) || (!button.action && button.action !== 0) || !button.style?.style))
            throw new Error("Every button should have customId, label or emoji, display style and action.");

        if (new Set(buttons.map((val) => JSON.stringify(val))).size < buttons.length)
            throw new Error("Buttons can not repeat.");

        if (new Set(buttons.map((val) => val.style?.customId)).size < buttons.map((val) => val.style?.customId).length)
            throw new Error("Buttons can not have similar customId.");

        this._buttons = buttons;

        return this;
    };

    /**
     * Sets filter options. Overrides current options.
     * @param {FilterOptions} options Options for filtering out button interactions.
     * @returns {this} Pagination.
     */
    public setFilterOptions(options:FilterOptions): this
    {
        if (this._isActive)
            throw new Error("The pagination is already sent.");

        if (options.noAccessReplyContent && typeof options.noAccessReplyContent === "string" && options.noAccessReplyContent.length < 1)
            throw new RangeError("Reply should be longer than zero symbols.");

        this._filterOptions = options;

        return this;
    };

    /**
     * Sets collector options. Overrides current options.
     * @param {FilterOptions} options Options for collecting button interactions.
     * @returns {this} Pagination.
     */
    public setCollectorOptions(options:ColletorOptions): this
    {
        if (this._isActive)
            throw new Error("The pagination is already sent.");

        if (options.maxIdleTime && (!Number.isInteger(options.maxIdleTime) || options.maxIdleTime < 0))
            throw new RangeError("Max collector's idle time should be a natural number!");

        if (options.maxInteractions && (!Number.isInteger(options.maxInteractions) || options.maxInteractions < 0))
            throw new RangeError("Max number of interactions should be a natural number!");

        if (options.maxUsers && (!Number.isInteger(options.maxUsers) || options.maxUsers < 0))
            throw new RangeError("Max number of users should be a natural number!");

        this._collectorOptions = options;

        return this;
    };

    /**
     * Sets active state.
     * @param {boolean} active Whether to set pagination as active. 
     * @returns {boolean} Active state.
     */
    protected _setActive(active = true): boolean
    {
        return this._isActive = active;
    };

    /**
     * Sets current page number.
     * @param {number} page Number of the page.
     * @returns {number} Number of the current page.
     */
    protected _setCurrentPage(page = 0): number
    {
        if (page < 0 || !Number.isInteger(page))
            throw new RangeError("Page should be natural.");

        return this._currentPage = page;
    };

    /**
     * Sets life-time of pagination.
     * @param {number} time Time in milliseconds.
     * @returns {number} Time in milliseconds.
     */
    protected _setTime(time:number): number
    {
        if (this._isActive)
            throw new Error("The pagination is already sent.");

        if (time < 0 || !Number.isInteger(time))
            throw new RangeError("Time should be natural.");

        if (time < 1000)
            throw new RangeError("Pagination should exist at least one second.");

        return this._time = time;
    };

    /**
     * Sets collector of the pagination.
     * @param {InteractionCollector<ButtonInteraction>} collector Collector that collects button interactions.
     * @returns {InteractionCollector<ButtonInteraction>} Collector that collects button interactions.
     */
    protected _setCollector(collector:InteractionCollector<ButtonInteraction>): InteractionCollector<ButtonInteraction>
    {
        if (!this._isActive)
            throw new Error("The pagination should be already sent!");

        if (this._collector)
            throw new Error("Can't reassign already assigned collector!");

        return this._collector = collector;
    };
};

export default PaginationData;