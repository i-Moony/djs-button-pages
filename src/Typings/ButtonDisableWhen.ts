import PaginationData from "../Classes/Paginations/Abstract/PaginationData";

/**
 * Type to represent when button should be disabled.
 */
type ButtonDisableWhen =
|   number
|   ((pagination:PaginationData, nextPage:number) => number)
|   ((pagination:PaginationData, nextPage:number) => Promise<number>);

export default ButtonDisableWhen;