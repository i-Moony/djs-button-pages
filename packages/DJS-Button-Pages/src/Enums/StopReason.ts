/**
 * Reasons for collector to be stopped.
 */
enum StopReason
{
    /**
     * Internal Deletion (caused by method). Needed because of ephemeral interactions.
     */
    InternalDeletion = "Deleted by internal method.",
    /**
     * Internal Stop (caused by method). Needed to describe why the pagination was stopped.
     */
    InternalStop = "Stopped by internal method."
};

export default StopReason;