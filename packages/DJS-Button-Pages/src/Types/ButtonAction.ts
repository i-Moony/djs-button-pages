import { ButtonInteraction } from "discord.js";
import PaginationSent from "../Structures/PaginationSent";
import Promised from "./Promised";

/**
 * Type for action that is called after the button is pressed.
 */
type ButtonAction = (pagination:PaginationSent, interaction:ButtonInteraction) => Promised<unknown>;

export default ButtonAction;