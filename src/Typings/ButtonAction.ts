import PaginationData from "../Classes/Paginations/Basic/PaginationData";

/**
 * Type to represent an action that should be completed when the button is pressed.
 * 
 * It may be either a number of a page or a function that determines number of a page.
 */
type ButtonAction =
|   number
|   ((pagination:PaginationData) => number)
|   ((pagination:PaginationData) => Promise<number>);

export default ButtonAction;