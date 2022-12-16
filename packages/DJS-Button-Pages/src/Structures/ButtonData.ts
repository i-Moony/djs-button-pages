/**
 * Button styling interface.
 */
export default interface ButtonData
{
    /**
     * Custom id for button.
     */
    customId: string,
    /**
     * Style for button.
     * "LINK" is excluded because it is impossible to get any feedback.
     */
    style: "PRIMARY" | "SECONDARY" | "DANGER" | "SUCCESS",
    /**
     * Label for button.
     */
    label?: string,
    /**
     * Emoji for button.
     */
    emoji?: string
};