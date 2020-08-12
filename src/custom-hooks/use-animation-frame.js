import { useRef, useLayoutEffect } from "react";

/**
 * Execute code in browser animation frames.
 * The callback is executed synchronously, so it should not be an heavy operation.
 */
function useAnimationFrame(callback, isPaused = false) {
    const requestRef = useRef();
    const previousTimestampRef = useRef();
    const cancelledFromOutsideRef = useRef(false);

    function animationFrameLoop(timestamp) {
        if (previousTimestampRef.current) {
            const deltaT = timestamp - previousTimestampRef.current;
            callback(deltaT);
            // Promise.resolve().then(() => callback(deltaT));
        }

        previousTimestampRef.current = timestamp;
        requestRef.current = requestAnimationFrame(animationFrameLoop);
    }

    useLayoutEffect(() => {
        if (!cancelledFromOutsideRef.current && !isPaused) {
            requestRef.current = requestAnimationFrame(animationFrameLoop);
            return () => {
                previousTimestampRef.current = null;
                cancelAnimationFrame(requestRef.current);
            };
        }
    }, [callback, isPaused]); // eslint-disable-line react-hooks/exhaustive-deps

    return () => {
        cancelledFromOutsideRef.current = true;
        cancelAnimationFrame(requestRef.current);
    };
}

export default useAnimationFrame;
