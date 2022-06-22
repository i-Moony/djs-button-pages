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

import { MessageButton } from "discord.js";
import ButtonAction from "../../Typings/ButtonAction";
import ButtonDisableWhen from "../../Typings/ButtonDisableWhen";
import ButtonData from "./Abstract/ButtonData";

/**
 * Custom button. Helps to create buttons with custom actions.
 */
class CustomButton extends ButtonData
{
    /**
     * Custom button. Helps to create buttons with custom actions.
     * @param {MessageButton} style Button style.
     */
    public constructor(style?:MessageButton)
    {
        super();

        if (style)
            this.setStyle(style);
    };

    /**
     * Sets button action.
     * @param {ButtonAction} action Page number or function that completes after the button is pressed.
     * @returns {this} Button data.
     */
    public setAction(action: ButtonAction): this
    {
        if (typeof action === "number" && (!Number.isInteger(action) || action < 0))
            throw new RangeError("Action should return natural number.");

        this._setAction(action);

        return this;
    };

    /**
     * Sets either a page number or a function that define when to disable button.
     * @param {((pagination:PaginationData, nextPage:number) => number | Promise<number>) | number} action Page number or function that completes after the button is pressed.
     * @returns {this} Button data.
     */
    public setDisableWhen(disableWhen: ButtonDisableWhen): this
    {
        if (typeof disableWhen === "number" && (!Number.isInteger(disableWhen) || disableWhen < -1))
            throw new RangeError("Action should return natural number or minus one to be always turned on.");

        this._setDisableWhen(disableWhen);

        return this;
    };
};

export default CustomButton;