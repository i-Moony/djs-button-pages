import PaginationData from "../Classes/Paginations/Abstract/PaginationData";

/**
 * Type to represent button action.
 * 
 * May be either a number of a page or a function that determines number of a page.
 */
type ButtonAction =
|   number
|   ((pagination:PaginationData) => number)
|   ((pagination:PaginationData) => Promise<number>);

export default ButtonAction;