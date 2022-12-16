import { MessageEmbed } from "discord.js";

/**
 * Gets embed length.
 * Includes author name, footer, fields, description and title.
 * @param {MessageEmbed} embed Embed which length should be counted.
 * @returns {number} Embed length.
 */
function getEmbedLength(embed:MessageEmbed): number
{
    return (embed.author?.name.length ?? 0) +
    (embed.footer?.text?.length ?? 0) +
    (embed.fields ? 
        embed.fields.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0)
        : 0
    ) +
    (embed.description?.length ?? 0) + 
    (embed.title?.length ?? 0);
};

export default getEmbedLength;