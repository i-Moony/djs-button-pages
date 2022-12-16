import { Message,
    Interaction,
    InteractionResponseFields } from "discord.js";
import PaginationSent from "../Structures/PaginationSent";
import Promised from "./Promised";

/**
 * Type for action that is called before or after the pagination is stopped.
 */
type StopAction = (reason:string, pagination:PaginationSent, message:(Interaction & InteractionResponseFields) | Message) => Promised<unknown>;

export default StopAction;