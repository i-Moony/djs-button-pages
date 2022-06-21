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
const enum globalConstants
{
    EMBED_TOTAL_MAX_LENGTH = 6000,

    DISCORD_TOTAL_BUTTONS_PER_ROW = 5,
    DISCORD_TOTAL_ROWS_PER_MESSAGE = 3,
    DISCORD_MAX_INTERACTION_LIFE_TIME = 900000,

    LIBRARY_MAX_PAGES_LIFE_TIME = 3600000,
    LIBRARY_MIN_PAGES_LIFE_TIME = 1000,
};

export default globalConstants;