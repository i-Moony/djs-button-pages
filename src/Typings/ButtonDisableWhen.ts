import PaginationData from "../Classes/Paginations/Abstract/PaginationData";

/**
 * Type to represent a condition of disabling button.
 * 
 * May be either a number of a page or a function that determines number of a page.
 */
type ButtonDisableWhen =
|   number
|   ((pagination:PaginationData, nextPage:number) => number)
|   ((pagination:PaginationData, nextPage:number) => Promise<number>);

export default ButtonDisableWhen;