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

import { Message,
    ReplyMessageOptions,
    User } from "discord.js";
import BasePagination from "./Basic/BasePagination";
import PaginationData from "./Basic/PaginationData";

/**
 * Pagination that is sent as a reply to message.
 */
class MessageReplyPagination extends BasePagination<ReplyMessageOptions>
{
    /**
     * Pagination that is sent as a reply to message.
     * @param {PaginationData} data Data from which to build message reply pagination.
     */
    public constructor(data?:PaginationData)
    {
        super(data);

        return;
    };

    /**
     * Sends pagination as the reply to specified message.
     * @param {Message} message Message to that the reply should be sent.
     * @param {User} user Needed only if one user should be able to use pagination.
     * @returns {Promise<void>} Sends pagination.
     */
    public async send(message:Message, user?:User)
    {
        if (this.isActive)
            throw new Error("The pagination is already sent!");

        if (!this.embeds || !this.buttons || !this.time)
            throw new Error("Pagination should have at least one button and page.");

        let replyOptions = this.messageOptions;

        if (!replyOptions)
            replyOptions = {embeds: []};

        this._setActive();
        this._setCurrentPage();

        replyOptions.embeds = [this.embeds[this.currentPage]];
        replyOptions.components = await this._getActionRows(0);

        const reply = await message.reply(replyOptions);
        
        const collector = this._formCollector(reply, user);
        
        collector.on("collect", async (interaction) => await this._collected(interaction));

        collector.on("end", async (collected, reason) => await this._stop(reason, reply));

        this._setCollector(collector);

        if (this.afterSending)
            await this.afterSending(reply);

        return;
    };
};

export default MessageReplyPagination;