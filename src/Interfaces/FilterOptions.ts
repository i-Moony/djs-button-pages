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
     * Defines whether the pagination should be available for only one user.
     */
    onlyOneUser?: boolean,
    /**
     * Whether to reply to user that can't use pagination or not.
     */
    sendReplyIfNotThatUser?: boolean,
    /**
     * Used if onlyOneUser and sendReplyIfNotThatUser options are true.
     * Defines reply to user that can't use pagination.
     */
    notThatUserReply?: string,
    /**
     * Maximum number of interactions that pagination can collect.
     */
    limitInteractions?: number,
    /**
     * Used if onlyOneUser option is false.
     * Maximum number of users that can interact with pagination during it's lifetime.
     */
    limitUsers?: number,
    /**
     * Maximum amount of time (in milliseconds) that pagination can be idle. Afterwards stops.
     */
    limitIdleTime?: number,
    /**
     * Option that defines if the pagination should reset the timer after collecting interaction.
     */
    resetTimer?: boolean,
    /**
     * Option that defines what to do with buttons after pagination is stopped.
     */
    removeButtonsAfterEnd?: boolean,
};

export default FilterOptions;