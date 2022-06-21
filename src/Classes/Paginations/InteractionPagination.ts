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

import { Interaction,
    InteractionReplyOptions,
    Message,
    User } from "discord.js";
import Constants from "../../Constants";
import { BasePagination } from "./Abstract/BasePagination";

class InteractionPagination extends BasePagination<InteractionReplyOptions>
{
    public constructor()
    {
        super();
    };

    public override setTime(time:number): this
    {
        if (this.isActive)
            throw new Error("The pagination is already sent.");

        if (time < 0 || !Number.isInteger(time))
            throw new RangeError("Time should be natural.");

        if (time < Constants.LIBRARY_MIN_PAGES_LIFE_TIME)
            throw new RangeError("Pagination should exist at least one second.");

        if (time > Constants.DISCORD_MAX_INTERACTION_LIFE_TIME)
            throw new RangeError(`Interaction pagination total life time should be no more than fifteen minutes.`);

        this._setTime(time);

        return this;
    };

    public override async send(interaction:Interaction, user?:User)
    {
        if (this.isActive)
            throw new Error("The pagination is already sent!");

        if (!this.embeds || !this.buttons || !this.time)
            throw new Error("Pagination should have at least one button and page.");

        if (!interaction.isRepliable())
            throw new Error("Interaction should be repliable!");

        let replyOptions = this.messageOptions;

        if (!interaction.deferred)
            await interaction.deferReply({ephemeral: replyOptions?.ephemeral ?? false, fetchReply: true});

        if (!replyOptions)
            replyOptions = {embeds: []};

        this._setActive();
        this._setCurrentPage();

        replyOptions.embeds = [this.embeds[this.currentPage]];
        replyOptions.components = await this._getActionRows(0);

        const reply = await interaction.editReply(replyOptions);

        let message:Message;

        if (!(reply instanceof Message))
        {
            message = await this._fetchMessage(interaction, reply.channel_id, reply.id);
        }
        else
        {
            message = reply;
        };
        
        const collector = message.createMessageComponentCollector({
            time: this.time,
            componentType: "BUTTON",
            maxUsers: this.filterOptions?.onlyAuthor ? undefined : this.filterOptions?.limitUsers,
            max: this.filterOptions?.limit,
            filter: this._formFilter(message, user)
        });

        this._setCollector(collector);
        
        collector.on("collect", async (interaction) => await this._collected(interaction));

        collector.on("end", async () => await this._stop(interaction));

        return;
    };
    
    private async _fetchMessage(interaction:Interaction, channelId:string, messageId:string): Promise<Message>
    {
        const channel = await interaction.client.channels.fetch(channelId).catch(() => undefined);

        if (!channel)
            throw new Error("Unable to find specified channel!");

        if (!channel.isText())
            throw new Error("Specified channel is not a text one!");

        const message = await channel.messages.fetch(messageId).catch(async () => undefined);

        if (!message)
            throw new Error("No message for this id!");

        return message;
    };
};

export { InteractionPagination };