/**
 * Represents pagination state.
 */
enum PaginationState
{
    /**
     * Setup in process.
     */
    NotReady,
    /**
     * Sent and working.
     */
    Ready,
    /**
     * Ended.
     */
    Over
};

export default PaginationState;