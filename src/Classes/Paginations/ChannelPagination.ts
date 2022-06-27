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

import { MessageOptions,
    TextBasedChannel,
    User } from "discord.js";
import BasePagination from "./Abstract/BasePagination";

/**
 * Pagination that is sent to a text channel.
 */
class ChannelPagination extends BasePagination<MessageOptions>
{
    /**
     * Pagination that is sent to a text channel.
     */
    public constructor()
    {
        super();
    };

    /**
     * Sends pagination to the specified channel.
     * @param {TextChannel | DMChannel} channel Channel where the pagination should be sent.
     * @param {User} user Needed only if one user should be able to use pagination.
     * @returns {Promise<void>} Sends pagination.
     */
    public async send(channel:TextBasedChannel, user?:User): Promise<void>
    {
        if (this.isActive)
            throw new Error("The pagination is already sent!");

        if (!this.embeds || !this.buttons || !this.time)
            throw new Error("Pagination should have at least one button and page.");

        let messageOptions = this.messageOptions;

        if (!messageOptions)
            messageOptions = {embeds: []};

        this._setActive();
        this._setCurrentPage();

        messageOptions.embeds = [this.embeds[this.currentPage]];
        messageOptions.components = await this._getActionRows(0);

        const message = await channel.send(messageOptions);

        const collector = this._formCollector(message, user);

        collector.on("collect", async (interaction) => await this._collected(interaction));

        collector.on("end", async () => await this._stop(message));
        
        this._setCollector(collector);

        if (this.actionAfterSending)
            await this.actionAfterSending();

        return;
    };
};

export default ChannelPagination;