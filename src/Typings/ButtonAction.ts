import PaginationData from "../Classes/Paginations/Abstract/PaginationData";

/**
 * Type to represent button action.
 */
type ButtonAction =
|   number
|   ((pagination:PaginationData) => number)
|   ((pagination:PaginationData) => Promise<number>);

export default ButtonAction;