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
 * Constants that may be changed in the future.
 */
enum Constants
{
    /**
     * Current Discord's embed length limit.
     */
    DISCORD_MAX_EMBED_LENGTH = 6000,

    /**
     * Current Discord's limit for buttons per row.
     */
    DISCORD_MAX_BUTTONS_PER_ROW = 5,
    /**
     * Current Discord's limit for rows per message.
     */
    DISCORD_MAX_ROWS_PER_MESSAGE = 3,
    /**
     * Current Discord's limit for interaction life-time.
     */
    DISCORD_MAX_INTERACTION_LIFE_TIME = 900000,

    /**
     * Current library limit for max pagination life-time.
     */
    LIBRARY_MAX_PAGES_LIFE_TIME = 3600000,
    /**
     * Current library limit for minimum pagination life-time.
     */
    LIBRARY_MIN_PAGES_LIFE_TIME = 1000,
};

export default Constants;