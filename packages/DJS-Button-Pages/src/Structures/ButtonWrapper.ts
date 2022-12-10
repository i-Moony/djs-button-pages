import { ButtonBuilder } from "discord.js";
import ButtonAction from "../Types/ButtonAction";
import ButtonSwitch from "../Types/ButtonSwitch";
import ButtonData from "./ButtonData";

/**
 * Class that wraps button's functionality.
 */
export default class ButtonWrapper
{
    private _data:Partial<ButtonData>;
    private _action:ButtonAction;
    private _switch:ButtonSwitch;
    
    /**
     * Class that wraps button's functionality.
     * @param {Partila<ButtonData> | ButtonWrapper} data Either an interface for button styling or the class to be built from.
     */
    public constructor(data?:Partial<ButtonData> | ButtonWrapper)
    {
        if (data)
            this.setData(data);
    };

    /**
     * Button's styling.
     */
    public get data(): Partial<ButtonData>
    {
        return this._data;
    };

    /**
     * Action that is called after the button is pressed.
     */
    public get action(): ButtonAction
    {
        return this._action;
    };

    /**
     * Action that is called to switch button's state.
     */
    public get switch(): ButtonSwitch
    {
        return this._switch;
    };

    /**
     * Ready button builder.
     */
    public get builtComponent(): ButtonBuilder
    {
        return new ButtonBuilder(this.toJSON());
    };

    /**
     * Sets buttons data.
     * @param {Partial<ButtonData> | ButtonWrapper} data Either an interface for button styling or the class to be built from.
     * @returns {this}
     */
    public setData(data:Partial<ButtonData> | ButtonWrapper): this
    {
        if (data instanceof ButtonWrapper)
        {
            this._data = data.data;
            this._action = data.action;
            this._switch = data.switch;
        }
        else
        {
            this._data = data;
        };

        return this;
    };

    /**
     * Sets action that is called after the button is pressed.
     * @param {ButtonAction} action Action that is called after the button is pressed.
     * @returns {this}
     */
    public setAction(action:ButtonAction): this
    {
        this._action = action;

        return this;
    };

    /**
     * Sets action that is called to switch button's state.
     * @param switchFunction Action that is called to switch button's state.
     * @returns {this}
     */
    public setSwitch(switchFunction:ButtonSwitch): this
    {
        this._switch = switchFunction;

        return this;
    };

    /**
     * Converts button styling to JSON-like object.
     * @returns {ButtonData} JSON-like object.
     */
    public toJSON(): ButtonData
    {
        return this._data as ButtonData;
    };
};