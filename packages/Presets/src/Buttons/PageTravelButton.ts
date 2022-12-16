import { ButtonData,
    ButtonWrapper, 
    PaginationSent,
    Constants } from "djs-button-pages";
import { ButtonInteraction,
    Message,
    MessageCollector } from "discord.js";
import LocaleGenerator from "../Types/LocaleGenerator";

/**
 * Bind for button that switches pagination to the page specified by user.
 */
export default class PageTravelButton extends ButtonWrapper
{
    private _duration = 15000;
    private _endPhrase = `end`;
    private _endTip:string | LocaleGenerator | undefined = `Type \`${this._endPhrase}\` to stop travelling.`;
    private _startTip:string | LocaleGenerator | undefined = `Now you have ${(this._duration / 1000).toFixed(0)} seconds, send numbers in chat to change pages!\n\nType \`${this._endPhrase}\` to exit from page travelling.`;
    private _travelSet:Set<string> = new Set();

    /**
     * Bind for button that switches pagination to the page specified by user.
     * @param {ButtonData} style Styling for button.
     */
    public constructor(style?:ButtonData)
    {
        super(style);

        this.setAction(this._doAction);
        this.setSwitch(PageTravelButton._switch);
    };

    /**
     * @returns {string} Phrase that stops page travel.
     */
    public get endPhrase(): string
    {
        return this._endPhrase;
    };

    /**
     * @returns {string | LocaleGenerator | undefined} Tip that will appear when person presses button but he's already travelling through pages.
     */
    public get endTip(): string | LocaleGenerator | undefined
    {
        return this._endTip;
    };

    /**
     * @returns {string | LocaleGenerator | undefined} Tip that will appear when person activates page travelling.
     */
    public get startTip(): string | LocaleGenerator | undefined
    {
        return this._startTip;
    };

    /**
     * @returns {number} Page travel duration.
     */
    public get duration(): number
    {
        return this._duration;
    };

    /**
     * Sets duration for page travel.
     * @param {number} duration Page travel duration.
     * @param {boolean} bypassLimits Should this method bypass limits of library or not.
     * @returns {this}
     */
    public setDuration(duration:number, bypassLimits = false): this
    {
        if (duration < 0 || !Number.isInteger(duration))
            throw new Error("[@DJS-Button-Pages/Presets]: Time should be integer!");

        if (!bypassLimits && duration < Constants.LibraryMinPageLifeTime)
            throw new Error("[@DJS-Button-Pages/Presets]: Page travel should last at least one second!");

        if (!bypassLimits && duration > Constants.LibraryMaxPageLifeTime)
            throw new RangeError("[@DJS-Button-Pages/Presets]: Page travel time should be no more than an hour due to optimization. If you want to bypass the limit, pass true as the second argument to this method.");

        this._duration = duration;

        return this;
    };

    /**
     * Sets phrase that ends page travel.
     * @param {string} phrase Phrase that ends page travel.
     * @returns {this}
     */
    public setEndPhrase(phrase: string): this
    {
        this._endPhrase = phrase;

        return this;
    };

    /**
     * Sets tip that will appear when person presses button but he's already travelling through pages.
     * @param {string | LocaleGenerator} tip Tip that will appear when person presses button but he's already travelling through pages.
     * @returns {this}
     */
    public setEndTip(tip: string | LocaleGenerator): this
    {
        this._endTip = tip;

        return this;
    };

    /**
     * Sets tip that will appear when person activates page travelling.
     * @param {string | LocaleGenerator} tip Tip that will appear when person activates page travelling.
     * @returns {this}
     */
    public setStartTip(tip: string | LocaleGenerator): this
    {
        this._startTip = tip;

        return this;
    };

    /**
     * Action that switches pagination to the page specified by user.
     * @param {PaginationSent} pagination Pagination.
     * @returns {Promise<void>}
     */
    private async _doAction(pagination:PaginationSent, interaction:ButtonInteraction): Promise<unknown>
    {
        if (this._travelSet.has(`${interaction.message.id}-${interaction.user.id}`))
        {
            if (this._endTip)
                await interaction.followUp({ephemeral: true, content: typeof this._endTip === "string" ? this._endTip : this._endTip(interaction, pagination, this)});

            return;
        };

        const collector = interaction.channel.createMessageCollector({
            filter: (msg) => msg.author.id === interaction.user.id,
            time: this._duration,
        });

        if (this._startTip)
            await interaction.followUp({ephemeral: true, content: typeof this._startTip === "string" ? this._startTip : this._startTip(interaction, pagination, this)});

        this._travelSet.add(`${interaction.message.id}-${interaction.user.id}`);

        collector.on("collect", async (message) => this._collect(message, pagination, collector));
        collector.on("end", () => {
            this._travelSet.delete(`${interaction.message.id}-${interaction.user.id}`)
        });

        return;
    };

    /**
     * Handles collect event for message collector.
     * @param {Message} message Message that user wrote.
     * @param {PaginationSent} pagination Pagination that should be updated.
     * @param {MessageCollector} collector Message collector.
     * @returns {Promise<void>}
     */
    private async _collect(message:Message, pagination:PaginationSent, collector:MessageCollector): Promise<void>
    {
        const content = message.content.trim().toLowerCase();

        if (content === this._endPhrase)
        {
            if (message.deletable)
                await message.delete().catch(() => {/**catch unexpected errors*/});

            return collector.stop();
        };

        const int = parseInt(content);

        if (isNaN(int) || int > pagination.data.embeds.length || int < 1)
            return;

        if (message.deletable)
            await message.delete().catch(() => {/**catch unexpected errors*/});

        return pagination.setPage(int - 1).update();
    };

    /**
     * Switch that never disables the button.
     * @returns {false}
     */
    private static _switch(): false
    {
        return false;
    };
};