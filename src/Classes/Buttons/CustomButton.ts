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
import ButtonData from "./Basic/ButtonData";

/**
 * Button with custom set of scripts.
 */
class CustomButton extends ButtonData
{
    /**
     * Button with custom set of scripts.
     * @param {MessageButton | CustomButton} data Data from which to build CustomButton.
     */
    public constructor(data?:MessageButton | ButtonData)
    {
        super(data);

        if (data instanceof CustomButton)
        {
            this._setupCustomData(data);
        };
    };

    /**
     * Sets an action that should be completed when the button is pressed.
     * @param {ButtonAction} action Either a number of a page or a function that determines number of a page.
     * @returns {this} Button data.
     */
    public setAction(action: ButtonAction): this
    {
        return this._setAction(action);
    };

    /**
     * Sets a condition of disabling button.
     * @param {ButtonDisableWhen} disableWhen Either a number of a page or a function that determines number of a page.
     * @returns {this} Button data.
     */
    public setDisableWhen(disableWhen: ButtonDisableWhen): this
    {
        return this._setDisableWhen(disableWhen);
    };

    /**
     * Setups action and disableWhen from ButtonData.
     * @param {CustomButton} data ButtonData.
     * @returns {void}
     */
    private _setupCustomData(data:CustomButton): void
    {
        if (data.action)
            this._setAction(data.action);

        if (data.disableWhen)
            this._setDisableWhen(data.disableWhen);

        return;
    };
};

export default CustomButton;