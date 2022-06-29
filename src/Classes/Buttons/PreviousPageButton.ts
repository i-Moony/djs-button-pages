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
 * Button that switches pagination to previous page.
 */
class PreviousPageButton extends ButtonData
{
    /**
     * Button that switches pagination to previous page.
     * @param {MessageButton} style Button style.
     */
    public constructor(style?:MessageButton)
    {
        super(style);

        this._setAction(PreviousPageButton._doAction);

        this._setDisableWhen(0);
    };

    /**
     * Gets previous page of pagination.
     * @param {PaginationData} pagination Pagination data.
     * @returns {Promise<number>} Page number.
     */
    private static async _doAction(pagination:PaginationData): Promise<number>
    {
        return pagination.currentPage - 1;
    };
};

export default PreviousPageButton;