/**
 * Type for values that are either promised or synchronous.
 */
type Promised<T> =
| T
| Promise<T>;

export default Promised;