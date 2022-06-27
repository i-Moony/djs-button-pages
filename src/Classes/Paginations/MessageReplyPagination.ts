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
import BasePagination from "./Abstract/BasePagination";

/**
 * Pagination that is sent as a reply to message.
 */
class MessageReplyPagination extends BasePagination<ReplyMessageOptions>
{
    /**
     * Pagination that is sent as a reply to message.
     */
    public constructor()
    {
        super();
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
        
        const collector = this._formCollector(message, user);
        
        collector.on("collect", async (interaction) => await this._collected(interaction));

        collector.on("end", async () => await this._stop(reply));

        this._setCollector(collector);

        if (this.actionAfterSending)
            await this.actionAfterSending();

        return;
    };
};

export default MessageReplyPagination;