/**
 * Library's constants.
 */
enum Constants
{
    /**
     * Max length for Discord's embed.
     */
    DiscordMaxEmbedLength = 6000,
    /**
     * Max quantity of buttons per Discord's action row.
     */
    DiscordMaxButtonsPerRow = 5,
    /**
     * Max quantity of rows per Discord's message.
     */
    DiscordMaxRowsPerMessage = 3,
    /**
     * Discord's limit for interaction life-time.
     */
    DiscordMaxInteractionLifeTime = 15000,
    /**
     * Library's limit for max pagination's life-time.
     */
    LibraryMaxPageLifeTime = 60000,
    /**
     * Library's limit for minimum pagination's life-time.
     */
    LibraryMinPageLifeTime = 1000,
};

export default Constants;