import { APIMessageComponentEmoji,
    ButtonStyle } from "discord.js";

/**
 * Button styling interface.
 */
export default interface ButtonData
{
    /**
     * Custom id for button.
     */
    custom_id: string,
    /**
     * Style for button.
     * {@link ButtonStyle.Link} is excluded because it is impossible to get any feedback.
     */
    style: Exclude<ButtonStyle, ButtonStyle.Link>,
    /**
     * Label for button.
     */
    label?: string,
    /**
     * Emoji for button.
     */
    emoji?: string | APIMessageComponentEmoji
};