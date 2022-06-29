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
 * Options for collecting button interactions.
 */
interface CollectorOptions
{
   /**
    * Maximum number of interactions that pagination can collect during it's life-time.
    */
   maxInteractions?: number,
   /**
    * Maximum number of users that can interact with pagination during it's life-time.
    */
   maxUsers?: number,
   /**
    * Maximum amount of time (in milliseconds) that pagination can be idle. Afterwards stops.
    */
   maxIdleTime?: number,
};
 
export default CollectorOptions;