import { ButtonInteraction } from "discord.js";
import { PaginationSent } from "djs-button-pages";
import PageTravelButton from "../Buttons/PageTravelButton";

/**
 * Type for function that generates locale.
 */
type LocaleGenerator = (interaction:ButtonInteraction, pagination:PaginationSent, button:PageTravelButton) => string;

export default LocaleGenerator;