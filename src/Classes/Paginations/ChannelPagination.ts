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

import { DMChannel,
    MessageOptions,
    TextChannel, 
    User } from "discord.js";
import BasePagination from "./Abstract/BasePagination";

class ChannelPagination extends BasePagination<MessageOptions>
{
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
    public async send(channel:TextChannel | DMChannel, user?:User): Promise<void>
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

        const collector = message.createMessageComponentCollector({
            time: this.time,
            componentType: "BUTTON",
            maxUsers: this.filterOptions?.onlyOneUser ? undefined : this.filterOptions?.limitUsers,
            max: this.filterOptions?.limitInteractions,
            idle: this.filterOptions?.limitIdleTime,
            filter: this._formFilter(message, user),
        });

        this._setCollector(collector);

        collector.on("collect", async (interaction) => await this._collected(interaction));

        collector.on("end", async () => await this._stop(message));

        if (this.actionAfterSending)
            await this.actionAfterSending();

        return;
    };
};

export default ChannelPagination;