import { ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ComponentType,
    InteractionCollector,
    Message, 
    MessageEditOptions, 
    RepliableInteraction } from "discord.js";
import StopReason from "../Enums/StopReason";
import PaginationData from "./PaginationData";
import Constants from "../Enums/Constants";
import ButtonData from "./ButtonData";
import ButtonWrapper from "./ButtonWrapper";
import StopAction from "../Types/StopAction";
import PaginationState from "../Enums/PaginationState";

/**
 * Class that represents pagination that is already sent.
 */
export default class PaginationSent
{
    private _state:PaginationState = PaginationState.NotReady;
    private _collector:InteractionCollector<ButtonInteraction>;

    /**
     * Class that represents pagination that is already sent.
     * @param {PaginationData} _data Embeds, buttons and so on.
     * @param {Message | RepliableInteraction} _message Message or interaction that pagination should be assigned to.
     * @param {number} _page Page which pagination should start from.
     * @param {StopAction | undefined} _beforeStopAction Action that is completed before the pagination is stopped.
     * @param {StopAction | undefined} _onStopAction Action that is completed after the pagination is stopped.
     */
    public constructor
    (
        private readonly _data:PaginationData,
        private readonly _message:Message | RepliableInteraction,
        private _page = 0,
        private readonly _beforeStopAction:StopAction | undefined,
        private readonly _onStopAction:StopAction | undefined
    ) {};

    /**
     * @returns {number} Current page.
     */
    public get page(): number
    {
        return this._page;
    };

    /**
     * @returns {PaginationData} Embeds, buttons and so on.
     */
    public get data(): PaginationData
    {
        return this._data;
    };

    /**
     * @returns {boolean} Is pagination active or not.
     */
    public get isActive(): boolean
    {
        return this._state === PaginationState.Ready;
    };

    /**
     * @returns {PaginationState} Pagination's state.
     */
    public get state(): PaginationState
    {
        return this._state;
    };

    /**
     * @returns {Message | RepliableInteraction} Message or interaction that pagination should be assigned to.
     */
    public get attachedTo(): Message | RepliableInteraction
    {
        return this._message;
    };

    /**
     * Gets button wrapper by custom id.
     * @param {string} custom_id Custom id.
     * @returns {ButtonWrapper | undefined} Button wrapper.
     */
    public getButtonByCustomId(custom_id:string): ButtonWrapper | undefined
    {
        return this._data.buttons.find((button) => button.data.custom_id === custom_id);
    };
    
    /**
     * Initializes pagination. Can be called only once.
     * Default pagination wrapper calls it so you shouldn't.
     * @returns {Promise<this>}
     */
    public async init(): Promise<this>
    {
        if (this._state !== PaginationState.NotReady)
            throw new Error("[DJS-Button-Pages]: Pagination is already active!");

        await this._formCollector();

        this._state = PaginationState.Ready;
        
        this._collector.on("collect", async (interaction) => this._collected(interaction));
        this._collector.once("end", async (collected, reason) => this._stopped(reason));

        await this.update();

        return this;
    };

    /**
     * Deletes pagination and stops it.
     * If pagination is an ephemeral interaction stops it instead.
     * @returns {Promise<void>}
     */
    public async delete(): Promise<void>
    {
        if (this._state !== PaginationState.Ready)
            throw new Error("[DJS-Button-Pages]: Pagination should be active!");

        try
        {
            this._message instanceof Message
                ? await this._message.delete()
                : await this._message.deleteReply();
        }
        catch (e) {/*Catch unexpected errors.*/};

        this._collector.stop(StopReason.InternalDeletion);

        return;
    };

    /**
     * Switches pagination to the next page.
     * It does not update the pagination, so you should call {@link update} by yourself!
     * @param {number} page Page number.
     * @returns {this}
     */
    public setPage(page: number): this
    {
        if (this._state !== PaginationState.Ready)
            throw new Error("[DJS-Button-Pages]: Pagination should be active!");

        if (!Number.isInteger(page))
            throw new RangeError("[DJS-Button-Pages]: Page number should be integer!");

        if (page < 0)
        {
            page = 0;
            console.warn("[DJS-Button-Pages]: You're passing in page number that is lesser than pagination has.")
        };

        if (page > this._data.embeds.length - 1)
        {
            page = this._data.embeds.length - 1;
            console.warn("[DJS-Button-Pages]: You're passing in page number that is greater than pagination has.");
        };

        this._page = page;

        return this;
    };

    /**
     * Updates pagination state.
     * @returns {Promise<void>}
     */
    public async update(): Promise<void>
    {
        if (this._state !== PaginationState.Ready)
            throw new Error("[DJS-Button-Pages]: Pagination should be active!");

        const embed = this._data.embeds[this._page];

        if (!embed)
            throw new Error("[DJS-Button-Pages]: Page for this button is not defined!");

        const rows = await this._buildPagedActionRows(),
        update:MessageEditOptions = {embeds: [embed], components: rows};

        try
        {
            this._message instanceof Message
                ? await this._message.edit(update)
                : await this._message.editReply(update);
        }
        catch (e) {/*Catch unexpected errors.*/};

        if (this._data.filterOptions.resetTimer)
            this._collector.resetTimer();

        return;
    };

    /**
     * Stops pagination.
     * @returns {void}
     */
    public stop(): void
    {
        if (this._state !== PaginationState.Ready)
            throw new Error("[DJS-Button-Pages]: Pagination should be active!");

        this._collector.stop(StopReason.InternalStop);

        return;
    };

    /**
     * Called than the collector collects interaction.
     * @param {ButtonInteraction} interaction Interaction that is fired.
     * @returns {Promise<void>}
     */
    private async _collected(interaction:ButtonInteraction): Promise<void>
    {
        const wrapper = this.getButtonByCustomId(interaction.customId);

        if (!wrapper)
            throw new Error("[DJS-Button-Pages]: Button should be defined!");

        await wrapper.action(this, interaction);

        return;
    };

    /**
     * Called than the pagination stopped.
     * @param {string} reason Reason why the pagination is stopped.
     * @returns {Promise<void>}
     */
    private async _stopped(reason:string): Promise<void>
    {
        this._state = PaginationState.Over;

        if (this._beforeStopAction)
            await this._beforeStopAction(reason, this, this._message);

        if ((!(this._message instanceof Message) && this._message.ephemeral) || (reason !== StopReason.InternalDeletion && reason !== 'messageDelete'))
        {
            const rows = this._buildActionRows(true),
            update:MessageEditOptions = {components: this._data.filterOptions.removeButtonsOnEnd
                ? []
                : rows};
    
            try
            {
                this._message instanceof Message
                    ? await this._message.edit(update)
                    : await this._message.editReply(update);
            }
            catch (e) {/*Catch unexpected errors.*/};
        };

        if (this._onStopAction)
            await this._onStopAction(reason, this, this._message);

        return;
    };

    /**
     * Builds action rows with enabled or disabled buttons.
     * @param {boolean} disabled Should be buttons disabled or not.
     * @returns {Array<ActionRowBuilder<ButtonBuilder>>}
     */
    private _buildActionRows(disabled = false): Array<ActionRowBuilder<ButtonBuilder>>
    {
        const rows:Array<ActionRowBuilder<ButtonBuilder>> = [];

        for (let i = 0; i < Constants.DiscordMaxRowsPerMessage - 1; i++)
        {
            rows.push(new ActionRowBuilder());

            this._data.buttons
                .slice(i*Constants.DiscordMaxButtonsPerRow, (i+1)*Constants.DiscordMaxButtonsPerRow)
                .forEach((button) => 
                {
                    rows[i].addComponents(button.builtComponent.setDisabled(disabled));
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
     * Builds action rows for specific page.
     * @returns {Promise<Array<ActionRowBuilder<ButtonBuilder>>>}
     */
    private async _buildPagedActionRows(): Promise<Array<ActionRowBuilder<ButtonBuilder>>>
    {
        const rows = this._buildActionRows();

        for (const row of rows)
            for (const button of row.components)
            {
                const wrapper = this.getButtonByCustomId((button.data as ButtonData).custom_id);

                if (!wrapper)
                    throw new Error("[DJS-Button-Pages]: Button should be defined!");

                button.setDisabled(wrapper.switch
                    ? await wrapper.switch(this)
                    : false);
            };

        return rows;
    };

    /**
     * Forms collector for pages.
     * @returns {Promise<void>}
     */
    private async _formCollector(): Promise<void>
    {
        if (!this._message || this._state !== PaginationState.NotReady)
            throw new Error("[DJS-Button-Pages]: This method should be executed after the message is defined.");

        const message = this._message instanceof Message
            ? this._message
            : await this._message.fetchReply();

        this._collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: this._data.time,
            maxUsers: this._data.filterOptions.maxUsers,
            max: this._data.filterOptions.maxInteractions,
            idle: this._data.filterOptions.maxIdleTime,
            filter: this._formFilter(message.id),
        });

        return;
    };

    /**
     * Forms filtering function for collector.
     * @param {string} messageId Reply id.
     * @returns {Promise<boolean>}
     */
    private _formFilter(messageId:string): (interaction:ButtonInteraction) => Promise<boolean>
    {
        return async (interaction:ButtonInteraction) => 
        {
            if (interaction.message.id !== messageId)
                return false;

            if (this._data.filterOptions.filterUsers && this._data.filterOptions.allowedUsers && !this._data.filterOptions.allowedUsers.includes(interaction.user.id))
            {
                if (this._data.filterOptions.noAccessReply && this._data.filterOptions.noAccessReplyContent)
                    await interaction.reply(typeof this._data.filterOptions.noAccessReplyContent === "string"
                        ? {content: this._data.filterOptions.noAccessReplyContent}
                        : this._data.filterOptions.noAccessReplyContent);

                return false;
            };

            await interaction.deferUpdate();

            return true;
        };
    };
};