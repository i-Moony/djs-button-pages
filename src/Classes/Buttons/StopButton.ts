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

import ButtonStyling from "../../Interfaces/ButtonStyling";
import ButtonData from "./Basic/ButtonData";

/**
 * Button that stops pagination.
 */
class StopButton extends ButtonData
{
    /**
     * Button that stops pagination.
     * @param {ButtonStyling} style Data from which to build StopButton.
     */
    public constructor(style?:ButtonStyling)
    {
        super(style);

        this._setAction(-1);

        this._setDisableWhen(-1);
    };
};

export default StopButton;