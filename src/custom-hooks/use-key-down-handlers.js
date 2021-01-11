import { useEffect, useRef } from "react";

function useKeyDownHandlers(keyHandlers) {
    const keyHandlersRef = useRef();

    useEffect(() => {
        keyHandlersRef.current = keyHandlers;
    }, [keyHandlers]);

    function handleKeyDown({ key }) {
        const keyHandler = keyHandlersRef.current && keyHandlersRef.current[key];
        if (keyHandler) {
            keyHandler();
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
}

export default useKeyDownHandlers;
