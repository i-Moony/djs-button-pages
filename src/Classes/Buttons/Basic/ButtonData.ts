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

import { APIButtonComponentWithCustomId } from "discord.js";
import ButtonAction from "../../../Typings/ButtonAction";
import ButtonDisableWhen from "../../../Typings/ButtonDisableWhen";

/**
 * Class for storing and modifying button data.
 */
class ButtonData
{
    /**
     * Class for storing and modifying button data.
     * @param {APIButtonComponentWithCustomId | ButtonData} data Data from which to build ButtonData.
     */
    public constructor(data?:APIButtonComponentWithCustomId | ButtonData)
    {
        if(!data)
            return;

        this._setup(data);

        return;
    };

    private _style:APIButtonComponentWithCustomId;
    private _action:ButtonAction;
    private _disableWhen:ButtonDisableWhen;

    /**
     * Style of this button.
     * @type {APIButtonComponentWithCustomId | null}
     */
    public get style(): APIButtonComponentWithCustomId | null
    {
        return this._style ?? null;
    };

    /**
     * Represents an action that should be completed after the button is pressed.
     * 
     * Either a number of a page or a function that determines number of a page.
     * @type {ButtonAction | null}
     */
    public get action(): ButtonAction | null
    {
        return this._action || this._action === 0 ? this._action : null;
    };

    /**
     * Represents a condition of disabling button.
     * 
     * Either a number of a page or a function that determines number of a page.
     * @type {ButtonDisableWhen | null}
     */
    public get disableWhen(): ButtonDisableWhen | null
    {
        return this._disableWhen || this._disableWhen === 0 ? this._disableWhen : null;
    };

    /**
     * Sets button style.
     * @param {APIButtonComponentWithCustomId} style Button style.
     * @returns {this} Button data.
     */
    public setStyle(style:APIButtonComponentWithCustomId): this
    {
        if (!style.custom_id || (!style.emoji && !style.label) || !style.style)
            throw new Error("Button should have customId, emoji or label and style.");

        this._style = style;

        return this;
    };

    /**
     * Sets an action that should be completed when the button is pressed.
     * @param {ButtonAction} action Either a number of a page or a function that determines number of a page.
     * @returns {this} Button data.
     */
    protected _setAction(action: ButtonAction): this
    {
        if (typeof action === "number" && (!Number.isInteger(action) || action < -1))
            throw new RangeError("Action should return natural number or minus one to stop pagination.");

        this._action = action;

        return this;
    };

    /**
     * Sets a condition of disabling button.
     * @param {ButtonDisableWhen} disableWhen Either a number of a page or a function that determines number of a page.
     * @returns {this} Button data.
     */
    protected _setDisableWhen(disableWhen: ButtonDisableWhen): this
    {
        if (typeof disableWhen === "number" && (!Number.isInteger(disableWhen) || disableWhen < -1))
            throw new RangeError("DisableWhen should return natural number or minus one to be always turned on.");

        this._disableWhen = disableWhen;

        return this;
    };

    /**
     * Setups class from style or ButtonData.
     * @param {APIButtonComponentWithCustomId | ButtonAction} data Style or data.
     * @returns {void}
     */
    private _setup(data: APIButtonComponentWithCustomId | ButtonData): void
    {
        if (!(data instanceof ButtonData))
        {
            this.setStyle(data);
        }
        else if (data.style)
        {
            this._style = data.style;
        };

        return;
    };
};

export default ButtonData;