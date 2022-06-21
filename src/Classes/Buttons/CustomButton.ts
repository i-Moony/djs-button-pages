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
import { PaginationData } from "../Paginations/Abstract/PaginationData";
import { ButtonData } from "./Abstract/ButtonData";

class CustomButton extends ButtonData
{
    public constructor(style?:MessageButton)
    {
        super();

        if (style)
            this.setStyle(style);
    };

    public setAction(action: ((pagination:PaginationData) => Promise<number>) | number): this
    {
        if (!action && action !== 0)
            throw new TypeError("Button action should be defined.");

        if (typeof action === "number" && (!Number.isInteger(action) || action < 0))
            throw new RangeError("Action should return natural number.");

        this._setAction(action);

        return this;
    };

    public setDisableWhen(disableWhen: ((pagination:PaginationData, nextPage:number) => Promise<number>) | number): this
    {
        if (!disableWhen && disableWhen !== 0)
            throw new TypeError("Button action should be defined.");

        if (typeof disableWhen === "number" && (!Number.isInteger(disableWhen) || disableWhen < -1))
            throw new RangeError("Action should return natural number or minus one to be always turned on.");

        this._setDisableWhen(disableWhen);

        return this;
    };
};

export { CustomButton };