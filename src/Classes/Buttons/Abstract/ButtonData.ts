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
import { PaginationData } from "../../Paginations/Abstract/PaginationData";

abstract class ButtonData
{
    private _style:MessageButton;
    private _action:((pagination:PaginationData) => Promise<number>) | number;
    private _disableWhen:((pagination:PaginationData, nextPage:number) => Promise<number>) | number;

    public get style(): MessageButton | null
    {
        return this._style ?? null;
    };

    public get action(): ((pagination:PaginationData) => Promise<number>) | number | null
    {
        return this._action || this._action === 0 ? this._action : null;
    };

    public get disableWhen(): ((pagination:PaginationData, nextPage:number) => Promise<number>) | number | null
    {
        return this._disableWhen || this._disableWhen === 0 ? this._disableWhen : null;
    };

    public setStyle(style:MessageButton): this
    {
        if (!style.customId || (!style.emoji && !style.label) || !style.style)
            throw new Error("Button should have customId, emoji or label and style.");

        if (style.style === "LINK")
            throw new Error("Button can't have link style, because component collector can't collect it's interaction.");

        this._style = style;

        return this;
    };

    protected _setAction(action: ((pagination:PaginationData) => Promise<number>) | number): this
    {
        if (typeof action === "number" && (!Number.isInteger(action) || action < -1))
            throw new RangeError("Action should return natural number or minus one to stop pagination.");

        this._action = action;

        return this;
    };

    protected _setDisableWhen(disableWhen: ((pagination:PaginationData, nextPage:number) => Promise<number>) | number): this
    {
        if (typeof disableWhen === "number" && (!Number.isInteger(disableWhen) || disableWhen < -1))
            throw new RangeError("Action should return natural number or minus one to be always turned on.");

        this._disableWhen = disableWhen;

        return this;
    };
};

export { ButtonData };