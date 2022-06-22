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

/**
 * Options for filtering button interactions.
 */
interface FilterOptions
{
    /**
     * If the pagination should be available only for one user.
     */
    onlyOneUser?: boolean,
    /**
     * Used if onlyOneUser option is enabled.
     * Defines reply to user that can't use pagination.
     */
    notThatUserReply?: string,
    /**
     * Maximum number of interactions that pagination can collect.
     */
    limitInteractions?: number,
    /**
     * Used if onlyOneUser option isn't enabled.
     * Maximum number of users that can interact with pagination.
     */
    limitUsers?: number,
    /**
     * Option that defines if the pagination should reset the timer after collecting interaction.
     */
    resetTimer?: boolean,
    /**
     * Option that defines what to do with buttons after pagination is stopped.
     * If enabled - removes them. If disabled - disables them.
     */
    removeButtonsAfterEnd?: boolean,
};

export default FilterOptions;