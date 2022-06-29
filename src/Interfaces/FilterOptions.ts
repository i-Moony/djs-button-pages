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

import { InteractionReplyOptions } from "discord.js";

/**
 * Options for filtering button interactions.
 */
interface FilterOptions
{
    /**
     * Option that defines if the pagination should be accessable only for one explict user.
     */
    singleUserAccess?: boolean,
    /**
     * Option that defines if the pagination should reply with a special message to user that has no access to use that pagination.
     * Works only in pair with {@link singleUserAccess}.
     */
    noAccessReply?: boolean,
    /**
     * Contents of the reply to user that has no access to use that pagination.
     * Works only with {@link singleUserAccess} and {@link noAccessReply}.
     */
    noAccessReplyContent?: string | InteractionReplyOptions,
    /**
     * Option that defines if the pagination should reset the timer after collecting interaction.
     */
    resetTimer?: boolean,
    /**
     * Option that defines what to do with buttons after the pagination is stopped.
     */
    removeButtonsOnEnd?: boolean,
};

export default FilterOptions;