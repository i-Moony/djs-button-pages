import { APIEmbed,
    InteractionReplyOptions,
    Embed,
    EmbedBuilder, 
    Message, 
    MessageCreateOptions, 
    MessageReplyOptions, 
    RepliableInteraction, 
    Snowflake, 
    TextBasedChannel} from "discord.js";
import FilterOptions from "./FilterOptions";
import PaginationData from "./PaginationData";
import ButtonWrapper from "./ButtonWrapper";
import AfterSendingAction from "../Types/AfterSendingAction";
import Constants from "../Enums/Constants";
import { getEmbedLength } from "../Utils/Utils";
import PaginationSent from "./PaginationSent";
import StopAction from "../Types/StopAction";

/**
 * Class that wraps pagination.
 */
export default class PaginationWrapper implements PaginationData
{
    private _buttons:Array<ButtonWrapper> = [];
    private _embeds:Array<EmbedBuilder> = [];
    private _time:number;
    private _filterOptions:FilterOptions = {};
    private _afterSendingAction:AfterSendingAction;
    private _beforeStopAction:StopAction;
    private _afterStopAction:StopAction;

    /**
     * Class that wraps pagination.
     * @param {PaginationData} data Data from which to build pagination.
     */
    public constructor(data:PaginationData)
    {
        if (data)
            this.overrideData(data);
    };

    /**
     * @returns {Array<ButtonWrapper>} Buttons for pagination.
     */
    public get buttons(): Array<ButtonWrapper>
    {
        return this._buttons;
    };

    /**
     * @returns {Array<APIEmbed>} Embeds for pagination.
     */
    public get embeds(): Array<APIEmbed>
    {
        return this._embeds.map((embed) => embed.data);
    };

    /**
     * @returns {FilterOptions} Options for filtering out interactions.
     */
    public get filterOptions(): FilterOptions
    {
        return this._filterOptions;
    };

    /**
     * @returns {number} Time that the pagination will be alive for.
     */
    public get time(): number
    {
        return this._time;
    };

    /**
     * @returns {AfterSendingAction} Action that is called after sending.
     */
    public get afterSendingAction(): AfterSendingAction
    {
        return this._afterSendingAction;
    };

    /**
     * @returns {StopAction} Action that is called before the pagination will be stopped.
     */
    public get beforeStopAction(): StopAction
    {
        return this._beforeStopAction;
    };

    /**
     * @returns {StopAction} Action that is called after the pagination is stopped.
     */
    public get afterStopAction(): StopAction
    {
        return this._afterStopAction;
    };

    /**
     * Gets button by it's customId.
     * @param {string} custom_id Custom id.
     * @returns {ButtonWrapper | undefined} Button.
     */
    public getButtonByCustomId(custom_id:string): ButtonWrapper | undefined
    {
        return this._buttons.find((button) => button.data.custom_id === custom_id);
    };

    /**
     * Sets action that will be called after sending.
     * @param {AfterSendingAction} action Action.
     * @returns {this}
     */
    public setAfterSendingAction(action:AfterSendingAction): this
    {
        this._afterSendingAction = action;

        return this;
    };

    /**
     * Sets action that will be called before the pagination is stopped.
     * @param {StopAction} action Action.
     * @returns {this}
     */
    public setBeforeStopAction(action:StopAction): this
    {
        this._beforeStopAction = action;

        return this;
    };

    /**
     * Sets action that will be called after the pagination is stopped.
     * @param {StopAction} action Action. 
     * @returns {this}
     */
    public setAfterStopAction(action:StopAction): this
    {
        this._afterStopAction = action;

        return this;
    };

    /**
     * Sets time that the pagination will be alive for.
     * @param {number} time Time.
     * @param {boolean} bypassLimits Should the time bypass limits or not. 
     * @returns {this}
     */
    public setTime(time:number, bypassLimits = false): this
    {
        if (time < 0 || !Number.isInteger(time))
            throw new Error("[DJS-Button-Pages]: Time should be integer!");

        if (!bypassLimits && time < Constants.LibraryMinPageLifeTime)
            throw new Error("[DJS-Button-Pages]: Pagination should exist at least one second!");

        if (!bypassLimits && time > Constants.LibraryMaxPageLifeTime)
            throw new RangeError("[DJS-Button-Pages]: Pagination total life time should be no more than an hour due to optimization. If you want to bypass the limit, pass true as the second argument to this method.");

        this._time = time;

        return this;
    };

    /**
     * Sets embeds for the pagination.
     * @param {Array<Embed | EmbedBuilder | APIEmbed>} embeds Embeds.
     * @returns {this}
     */
    public setEmbeds(embeds:Array<Embed | EmbedBuilder | APIEmbed>): this
    {
        const embedBuilders:Array<EmbedBuilder> = embeds.map((embed) => EmbedBuilder.from(embed));

        if (embedBuilders.some((embed) => !embed || getEmbedLength(embed.data) <= 0))
            throw new Error("[DJS-Button-Pages]: No embeds from the array can be empty!");

        if (embedBuilders.some((embed) => getEmbedLength(embed.data) > Constants.DiscordMaxEmbedLength))
            throw new RangeError(`[DJS-Button-Pages]: No embeds from the array can be longer than ${Constants.DiscordMaxEmbedLength}.`);

        this._embeds = embedBuilders;

        return this;
    };

    /**
     * Sets buttons for the pagination.
     * @param {ButtonWrapper | Array<ButtonWrapper>} buttons Buttons.
     * @returns {this}
     */
    public setButtons(buttons:ButtonWrapper | Array<ButtonWrapper>): this
    {
        if (!Array.isArray(buttons))
            buttons = [buttons];

        if (buttons.length > Constants.DiscordMaxButtonsPerRow * Constants.DiscordMaxRowsPerMessage)
            throw new RangeError(`[DJS-Button-Pages]: There can not be more than ${Constants.DiscordMaxButtonsPerRow * Constants.DiscordMaxRowsPerMessage}.`);

        if (new Set(buttons.map((button) => button.data.custom_id)).size < buttons.length)
            throw new Error("[DJS-Button-Pages]: Buttons can not have similar customIds.");

        this._buttons = buttons;

        return this;
    };

    /**
     * Sets options for filtering out interactions.
     * @param {FilterOptions} options Options for filtering out interactions.
     * @returns {this}
     */
    public setFilterOptions(options:FilterOptions): this
    {
        if (options.maxIdleTime && (!Number.isInteger(options.maxIdleTime) || options.maxIdleTime < 0))
            throw new RangeError("[DJS-Button-Pages]: Max collector's idle time should be a natural number!");

        if (options.maxInteractions && (!Number.isInteger(options.maxInteractions) || options.maxInteractions < 0))
            throw new RangeError("[DJS-Button-Pages]: Max number of interactions should be a natural number!");

        if (options.maxUsers && (!Number.isInteger(options.maxUsers) || options.maxUsers < 0))
            throw new RangeError("[DJS-Button-Pages]: Max number of users should be a natural number!");

        if (typeof options.noAccessReplyContent === "string" && options.noAccessReplyContent.length < 1)
            throw new Error("[DJS-Button-Pages]: Reply should be longer than zero symbols.");

        this._filterOptions = options;

        return this;
    };

    /**
     * Sets allowed users for pagination.
     * @param {Array<Snowflake>} users User's snowflake.
     * @returns {this}
     */
    public setAllowedUsers(users:Array<Snowflake>): this
    {
        this._filterOptions.allowedUsers = users;

        return this;
    };

    /**
     * Adds user(-s) to allowed list.
     * @param {Snowflake | Array<Snowflake>} users User(-s).
     * @returns {this}
     */
    public addAllowedUsers(users:Snowflake | Array<Snowflake>): this
    {
        if (!Array.isArray(users))
            users = [users];

        if (!this._filterOptions.allowedUsers)
            this._filterOptions.allowedUsers = [];

        this._filterOptions.allowedUsers.push(...users);

        return this;
    };

    /**
     * Sends pagination to the channel.
     * @param {TextBasedChannel} channel Channel.
     * @param {MessageCreateOptions} options Message options.
     * @param {number} page Page number which will be the starting point.
     * @returns {Promise<PaginationSent>} Class that represents pagination that is already sent.
     */
    public async send(channel:TextBasedChannel, options:MessageCreateOptions = {}, page = 0): Promise<PaginationSent>
    {
        if (page < 0 || !Number.isInteger(page))
            throw new RangeError("[DJS-Button-Pages]: Page number should be integer!");

        if (page > this.embeds.length - 1)
            console.warn("[DJS-Button-Pages]: You're passing in page number that is greater than pagination has.");

        page = page > this.embeds.length
            ? this.embeds.length
            : page;

        options.embeds = [this.embeds[page]];
        options.components = [];

        const message = await channel.send(options);

        if (this._afterSendingAction)
            await this._afterSendingAction(message);

        const paginationSent = new PaginationSent(this, message, page, this._beforeStopAction, this._afterStopAction);

        return paginationSent.init();
    };

    /**
     * Sends pagination as a reply to message.
     * @param {Message} replyTo Message.
     * @param {MessageReplyOptions} options Message options.
     * @param {number} page Page number which will be the starting point.
     * @returns {Promise<PaginationSent>} Class that represents pagination that is already sent.
     */
    public async reply(replyTo:Message, options:MessageReplyOptions = {}, page = 0): Promise<PaginationSent>
    {
        if (page < 0 || !Number.isInteger(page))
            throw new RangeError("[DJS-Button-Pages]: Page number should be integer!");

        if (page > this.embeds.length - 1)
            console.warn("[DJS-Button-Pages]: You're passing in page number that is greater than pagination has.");

        page = page > this.embeds.length
            ? this.embeds.length
            : page;

        options.embeds = [this.embeds[page]];
        options.components = [];

        const message = await replyTo.reply(options);

        if (this._afterSendingAction)
            await this._afterSendingAction(message);

        const paginationSent = new PaginationSent(this, message, page, this._beforeStopAction, this._afterStopAction);

        return paginationSent.init();
    };

    /**
     * Sends pagination as a reply to interaction.
     * @param {RepliableInteraction} interaction Interaction.
     * @param {InteractionReplyOptions} options Reply options.
     * @param {number} page Page number which will be the starting point.
     * @returns {Promise<PaginationSent>} Class that represents pagination that is already sent.
     */
    public async interactionReply(interaction:RepliableInteraction, options:InteractionReplyOptions = {}, page = 0): Promise<PaginationSent>
    {
        await interaction.deferReply();

        if (page < 0 || !Number.isInteger(page))
            throw new RangeError("[DJS-Button-Pages]: Page number should be integer!");

        if (page > this.embeds.length - 1)
            console.warn("[DJS-Button-Pages]: You're passing in page number that is greater than pagination has.");

        page = page > this.embeds.length
            ? this.embeds.length
            : page;

        options.embeds = [this.embeds[page]];
        options.components = [];

        const reply = await interaction.editReply(options);

        if (this._afterSendingAction)
            await this._afterSendingAction(reply);

        const paginationSent = new PaginationSent(this, interaction, page, this._beforeStopAction, this._afterStopAction);

        return paginationSent.init();
    };

    /**
     * Transforms class to JSON-like object.
     * @returns {PaginationData} JSON-like object.
     */
    public toJSON(): PaginationData
    {
        return {
            embeds: this.embeds,
            buttons: this.buttons,
            filterOptions: this.filterOptions,
            time: this.time,
        };
    };

    /**
     * Overrides pagination data.
     * @param {PaginationData} data Pagination data.
     * @returns {void}
     */
    public overrideData(data:PaginationData): void
    {
        const { embeds, buttons, filterOptions, time } = data;

        if (embeds)
            this.setEmbeds(embeds);

        if (buttons)
            this.setButtons(buttons);

        if (filterOptions)
            this.setFilterOptions(filterOptions);

        if (time)
            this.setTime(time);

        return;
    };
};