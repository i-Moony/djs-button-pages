import { Message } from "discord.js";
import Promised from "./Promised";

/**
 * Type for action that runs after the pagination is sent.
 */
type AfterSendingAction = (message:Message) => Promised<unknown>;

export default AfterSendingAction;