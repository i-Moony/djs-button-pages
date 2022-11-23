import PaginationSent from "../Structures/PaginationSent";
import Promised from "./Promised";

/**
 * Type for action that switches button state.
 */
type ButtonSwitch = (pagination:PaginationSent) => Promised<boolean>;

export default ButtonSwitch;