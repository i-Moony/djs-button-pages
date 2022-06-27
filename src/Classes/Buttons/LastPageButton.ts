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
import PaginationData from "../Paginations/Abstract/PaginationData";
import ButtonData from "./Abstract/ButtonData";

/**
 * Button that switches pagination to the last page.
 */
class LastPageButton extends ButtonData
{
    /**
     * Button that switches pagination to the last page.
     * @param {MessageButton} style Button style.
     */
    public constructor(style?:MessageButton)
    {
        super();

        if (style)
            this.setStyle(style);

        this._setAction(LastPageButton._doAction);

        this._setDisableWhen(LastPageButton._doAction);
    };

    /**
     * Gets number of the last page of the pagination.
     * @param {PaginationData} pagination Pagination Data.
     * @returns {Promise<number>} Last page number.
     */
    private static async _doAction(pagination:PaginationData): Promise<number>
    {
        if (!pagination.embeds)
            throw new Error("Last page button can't be used before embeds are supplied to the pagination.");

        return pagination.embeds.length - 1;
    };
};

export default LastPageButton;