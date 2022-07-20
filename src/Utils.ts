import { APIEmbed } from "discord.js";

/**
 * Counts embed length.
 * @param {APIEmbed} embed Embed.
 * @returns {number} Length.
 */
function getEmbedLength(embed:APIEmbed): number
{
    return (embed.author?.name.length ?? 0) +
    (embed.footer?.text?.length ?? 0) +
    (embed.fields ? 
        embed.fields.length >= 1 
            ? embed.fields.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0)
            : 0
        : 0
    ) +
    (embed.description?.length ?? 0) + 
    (embed.title?.length ?? 0);
};

export { getEmbedLength };